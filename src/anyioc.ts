import { App, Middleware, FlowContext, Next } from "anyflow";

interface ctor<T> {
    new(): T;
}

namespace Utils {
    export class RecursiveDetecter<T> {
        private _chain = new Set<T>();

        private _enter(key: T) {
            const n = this._chain.size;
            this._chain.add(key);
            if (n === this._chain.size) {
                throw new Error('recursive redirect.');
            }
        }

        private _exit(key: T) {
            this._chain.delete(key);
        }

        with<R>(key: T, callback: () => R): R {
            this._enter(key);
            try {
                return callback();
            } finally {
                this._exit(key);
            }
        }
    }

    function isConstructor(func: Function) {
        if (func.prototype.constructor) {

        }
    }
}

type Token = string | symbol | ctor<any>;

namespace Services {

    export type Token = string | symbol | ctor<any>;

    export type Options = {
        useNew?: boolean;
        singleton?: boolean;
        deps?: Token[];
        async?: boolean;
    };

    export interface Descriptor {
        id: symbol;
        token: Token;
        factory: (...args: any[]) => any;

        singleton: boolean;
        deps: Token[] | null;
        async: boolean;
    }

    export interface ServiceInfo {
        service: Descriptor;
        deps: ServiceInfo[] | null;
    }

    function getName(token: Token): string {
        if (typeof token === 'function') {
            return token.name;
        }
        return token.toString();
    }
}

namespace Resolvers {

    class FinalTokenResolver {
        private _map = new Map<Token, Token>();
        private _directMap = new Map<Token, Token>();

        private _resolveFinalSymbol(detecter: Utils.RecursiveDetecter<Token>, token: Token): Token {
            let finalSymbol = token;
            const next = this._map.get(token);
            if (next !== undefined) {
                finalSymbol = detecter.with(token, () => {
                    return this._resolveFinalSymbol(detecter, next);
                });
            }
            this._directMap.set(token, finalSymbol);
            return finalSymbol;
        }

        private _resolveSymbol(token: Token): Token | undefined {
            const ret = this._map.get(token);
            if (ret === undefined) {
                return undefined;
            }
            const detecter = new Utils.RecursiveDetecter<Token>();
            return this._resolveFinalSymbol(detecter, ret);
        }

        getResolvedSymbolToken(token: Token): Token | undefined {
            let finalSymbol = this._directMap.get(token);
            if (finalSymbol === undefined) {
                finalSymbol = this._resolveSymbol(token);
            }
            return finalSymbol;
        }

        redirect(src: Token, dest: Token) {
            this._map.set(src, dest);
        }
    }

    export class ServiceDescriptorResolver {
        private _tokenResolver = new FinalTokenResolver();
        map = new Map<Token, Services.Descriptor>();

        resolve(state: Token, required: true): Services.Descriptor;
        resolve(state: Token, required: false): Services.Descriptor | null;
        resolve(state: Token, required: boolean): Services.Descriptor | null {
            let token = this._tokenResolver.getResolvedSymbolToken(state);
            if (token !== undefined) {
                const descriptor = this.map.get(token);
                if (descriptor) {
                    return descriptor;
                }
            }
            if (required) {
                throw new Error(`cannot resolve token: ${state.toString()}`);
            }
            return null;
        }

        redirect(src: Token, dest: Token) {
            this._tokenResolver.redirect(src, dest);
        }
    }

    export class ServiceInfoResolver {
        constructor(private _descriptorResolver: ServiceDescriptorResolver) {

        }

        resolve(state: Token): Services.ServiceInfo | null {
            const service = this._descriptorResolver.resolve(state, false);
            if (service) {
                return this.resolveServiceInfo(new Utils.RecursiveDetecter<Token>(), service);
            }
            return null;
        }

        private resolveServiceInfo(detecter: Utils.RecursiveDetecter<Token>, service: Services.Descriptor)
            : Services.ServiceInfo {
            const serviceInfo: Services.ServiceInfo = {
                service,
                deps: null
            };
            if (service.deps) {
                const deps = service.deps
                    .map(z => this._descriptorResolver.resolve(z, true));
                serviceInfo.deps = detecter.with(service.token, () => {
                    return deps.map(z => this.resolveServiceInfo(detecter, z))
                });
            }
            return serviceInfo;
        }
    }

    export type State = {
        serviceInfo: Services.ServiceInfo
    };

    class Cache implements Middleware<State> {
        private _cache = new Map<symbol, {
            value: any
        }>();

        async invoke(context: FlowContext<State>, next: Next): Promise<any> {
            const service = context.state.serviceInfo.service;
            let value: any;
            if (service.singleton) {
                let node = this._cache.get(service.id);
                if (!node) {
                    value = await next();
                    this._cache.set(service.id, node = {
                        value
                    });
                } else {
                    value = node.value;
                }
            } else {
                value = await next();
            }
            return value;
        }
    }

    class Maker implements Middleware<State> {
        constructor(private _valueResolver: Resolvers.ValueResolver) {

        }

        async invoke(context: FlowContext<State>): Promise<any> {
            const serviceInfo = context.state.serviceInfo;
            let value: any;
            if (serviceInfo.deps) {
                const args = [];
                for (const dep of serviceInfo.deps) {
                    args.push(await this._valueResolver.getService(dep));
                }
                value = serviceInfo.service.factory.apply(null, args);
            } else {
                value = serviceInfo.service.factory();
            }
            if (serviceInfo.service.async) {
                return await value;
            }
            return value;
        }
    }

    export class ValueResolver {
        private _flow = new App<State>();

        constructor(private _serviceInfoResolver: ServiceInfoResolver) {
            this._flow.use(new Cache());
            this._flow.use(new Maker(this));
        }

        resolve<T>(token: Token): Promise<T | null> {
            const serviceInfo = this._serviceInfoResolver.resolve(token);
            if (serviceInfo) {
                return this.getService(serviceInfo);
            } else {
                return Promise.resolve(null);
            }
        }

        getService(serviceInfo: Services.ServiceInfo): Promise<any> {
            return this._flow.run({
                serviceInfo
            });
        }
    }
}

class Ioc {
    private _storage = new Resolvers.ServiceDescriptorResolver();
    private _valueResolver: Resolvers.ValueResolver;

    constructor() {
        const serviceInfoResolver = new Resolvers.ServiceInfoResolver(this._storage);
        this._valueResolver = new Resolvers.ValueResolver(serviceInfoResolver);
    }

    define<T>(type: ctor<T>, options?: Services.Options): this;
    define<TS, TI extends TS>(type: ctor<TS>, factory: () => TI, options?: Services.Options) : this;
    define(name: string | symbol, factory: () => any, options?: Services.Options) : this;
    define(token: Token, factory?: (() => any) | Services.Options, options?: Services.Options) {
        if (typeof factory === 'object') {
            options = factory;
            factory = undefined;
        }

        if (!factory) {
            factory = () => new (token as ctor<any>)();
        }

        const id = Symbol();
        const service: Services.Descriptor = {
            id,
            token,
            factory,
            singleton: false,
            deps: null,
            async: false
        }
        if (options) {
            service.singleton = !!options.singleton;
            service.async = !!options.async;
            if (options.deps) {
                service.deps = options.deps;
            }
        }
        this._storage.redirect(token, id);
        this._storage.map.set(id, service);

        return this;
    }

    bind(src: Token, dest: Token) {
        this._storage.redirect(src, dest);
    }

    get<T>(token: Token): Promise<T | null> {
        return this._valueResolver.resolve<T>(token);
    }

    async getRequired<T>(name: Token): Promise<T> {
        const value = await this.get<any>(name);
        if (value === null) {
            throw new Error('no such service.');
        }
        return value;
    }
}

class IocBuilder {
    use(component: any) {

    }

    useAlias() {

    }

    build() {

    }
}

(async function() {
    class A {}
    class B extends A {}
    class C {}
    const ioc = new Ioc();
    ioc.define(A, () => new B());
    console.log(await ioc.get(A) instanceof B);
    ioc.bind('a', A);
    console.log(await ioc.get('a') instanceof B);
    console.log(await ioc.get('a') !== await ioc.get('a'));
    console.log(await ioc.get('b') === null);
    ioc.define(C);
    console.log(await ioc.get(C) instanceof C);
})();
