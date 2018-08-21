/* Copyright (c) 2018~2999 - Cologler <skyoflw@gmail.com> */

export const Symbols = {
    Provider: Symbol('Provider'),
    RootProvider: Symbol('RootProvider'),
    Cache: Symbol('Cache'),
    MissingResolver: Symbol('MissingResolver'),
}

export interface IServiceProvider {
    get<V>(key: any): V;
    scope(): IServiceProvider;
    registerServiceInfo(key: any, serviceInfo: Service.IServiceInfo): void;
    registerValue(key: any, value: any): void;
    register(key: any, factory: Factory, lifetime: LifeTime): void;
    registerTransient(key: any, factory: Factory): void;
    registerScoped(key: any, factory: Factory): void;
    registerSingleton(key: any, factory: Factory): void;
    registerGroup(key: any, keys: any[]): void;
}

export type Factory = (provider: IServiceProvider) => any;

export enum LifeTime {
    Transient = 0,
    Scoped,
    Singleton,
}

export namespace Service {

    export interface IServiceInfo {
        get(provider: IServiceProvider): any;
    }

    export class ServiceInfo implements IServiceInfo {
        private _cache_value: [any] | null = null;

        constructor(private _factory: Factory, private _lifetime: LifeTime) {
        }

        get(provider: IServiceProvider): any {
            switch (this._lifetime) {
                case LifeTime.Transient:
                    return this._factory(provider);

                case LifeTime.Scoped:
                    const cache = provider.get<Map<IServiceInfo, any>>(Symbols.Cache);
                    if (!cache.has(this)) {
                        cache.set(this, this._factory(provider));
                    }
                    return cache.get(this);

                case LifeTime.Singleton:
                    if (this._cache_value === null) {
                        provider = provider.get<IServiceProvider>(Symbols.RootProvider);
                        this._cache_value = [this._factory(provider)];
                    }
                    return this._cache_value[0];
            }
        }
    }

    export class ProviderServiceInfo implements IServiceInfo {
        get(provider: IServiceProvider) {
            return provider;
        }
    }

    export class ValueServiceInfo implements IServiceInfo {
        constructor(private _value: any) {
        }

        get(provider: IServiceProvider) {
            return this._value;
        }
    }

    export class GroupedServiceInfo implements IServiceInfo {
        constructor(private _keys: any[]) {
        }

        get(provider: IServiceProvider) {
            return this._keys.map(key => provider.get(key));
        }
    }
}

export namespace Missing {
    export interface IMissingResolver {
        get(provider: IServiceProvider, key: any): any;
    }

    export class MissingResolver implements IMissingResolver {
        get(provider: IServiceProvider, key: any): any {
            return undefined;
        }
    }
}

namespace Utils {
    export class ChainMap<K, V> {
        private _maps: Array<Map<K, V>>;

        constructor(parents: Array<Map<K, V>> = []) {
            this._maps = [new Map<K, V>()];
            this._maps.push(...parents);
        }

        get(key: K) {
            for (const map of this._maps) {
                if (map.has(key)) {
                    return map.get(key);
                }
            }
            return undefined;
        }

        set(key: K, value: V) {
            this._maps[0].set(key, value);
        }

        child(): ChainMap<K, V> {
            return new ChainMap(this._maps);
        }
    }
}

class ScopedServiceProvider implements IServiceProvider {
    constructor(private _services: Utils.ChainMap<any, Service.IServiceInfo>) {
        this._services.set(Symbols.Cache,
            new Service.ValueServiceInfo(
                new Map<Service.IServiceInfo, any>()
            )
        );
    }

    get<V>(key: any): V {
        const serviceInfo = this._services.get(key);
        if (serviceInfo) {
            return <V> serviceInfo.get(this);
        }

        const resolverServiceInfo = <Service.IServiceInfo>this._services.get(Symbols.MissingResolver);
        const resolver = <Missing.IMissingResolver> resolverServiceInfo.get(this);
        return <V> resolver.get(this, key);
    }

    registerServiceInfo(key: any, serviceInfo: Service.IServiceInfo) {
        this._services.set(key, serviceInfo);
    }

    registerValue(key: any, value: any) {
        this._services.set(key, new Service.ValueServiceInfo(value));
    }

    register(key: any, factory: Factory, lifetime: LifeTime) {
        this._services.set(key, new Service.ServiceInfo(factory, lifetime));
    }

    registerTransient(key: any, factory: Factory) {
        return this.register(key, factory, LifeTime.Transient);
    }

    registerScoped(key: any, factory: Factory) {
        return this.register(key, factory, LifeTime.Scoped);
    }

    registerSingleton(key: any, factory: Factory) {
        return this.register(key, factory, LifeTime.Singleton);
    }

    registerGroup(key: any, keys: any[]) {
        this._services.set(key, new Service.GroupedServiceInfo(keys));
    }

    scope(): IServiceProvider {
        return new ScopedServiceProvider(this._services.child());
    }
}

export class ServiceProvider extends ScopedServiceProvider {
    constructor() {
        super(new Utils.ChainMap());
        this.registerServiceInfo(Symbols.Provider, new Service.ProviderServiceInfo());
        this.registerValue(Symbols.RootProvider, this);
        this.registerValue(Symbols.MissingResolver, new Missing.MissingResolver());
        // alias
        this.registerTransient('ioc', ioc => ioc.get(Symbols.Provider));
        this.registerTransient('provider', ioc => ioc.get(Symbols.Provider));
        this.registerTransient('service_provider', ioc => ioc.get(Symbols.Provider));
    }
}
