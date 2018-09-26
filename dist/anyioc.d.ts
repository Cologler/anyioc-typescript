export declare const Symbols: {
    Provider: symbol;
    RootProvider: symbol;
    Cache: symbol;
    MissingResolver: symbol;
};
export interface IServiceProvider {
    /**
     * resolve value by key.
     *
     * @template V
     * @param {*} key
     * @returns {V}
     * @memberof IServiceProvider
     */
    get<V>(key: any): V | undefined;
    /**
     * create a new scoped `IServiceProvider`.
     *
     * @returns {IServiceProvider}
     * @memberof IServiceProvider
     */
    scope(): IServiceProvider;
    /**
     * register a `Service.IServiceInfo` into the container.
     *
     * @param {*} key
     * @param {Services.IServiceInfo} serviceInfo
     * @memberof IServiceProvider
     */
    registerServiceInfo(key: any, serviceInfo: IServiceInfo): void;
    /**
     * register a value into the container.
     *
     * value always be singleton.
     *
     * @param {*} key
     * @param {*} value
     * @memberof IServiceProvider
     */
    registerValue(key: any, value: any): void;
    /**
     * register a factory into the container.
     *
     * @param {*} key
     * @param {Factory} factory
     * @param {LifeTime} lifetime
     * @memberof IServiceProvider
     */
    register(key: any, factory: Factory, lifetime: LifeTime): void;
    /**
     * register a transient factory into the container.
     *
     * transient mean the instance will never cache.
     *
     * @param {*} key
     * @param {Factory} factory
     * @memberof IServiceProvider
     */
    registerTransient(key: any, factory: Factory): void;
    /**
     * register a scoped factory into the container.
     *
     * scoped mean the instance is singleton in each scoped `IServiceProvider`.
     *
     * @param {*} key
     * @param {Factory} factory
     * @memberof IServiceProvider
     */
    registerScoped(key: any, factory: Factory): void;
    /**
     * register a singleton factory into the container.
     *
     * @param {*} key
     * @param {Factory} factory
     * @memberof IServiceProvider
     */
    registerSingleton(key: any, factory: Factory): void;
    /**
     * register a group keys into the container.
     *
     * when you resolve the `key`, will return a array by `keys`.
     *
     * @param {*} key
     * @param {any[]} keys
     * @memberof IServiceProvider
     */
    registerGroup(key: any, keys: any[]): void;
}
export declare type Factory = (provider: IServiceProvider) => any;
export declare enum LifeTime {
    Transient = 0,
    Scoped = 1,
    Singleton = 2
}
export interface IServiceInfo {
    /**
     * resolve value with `IServiceProvider`
     *
     * @param {IServiceProvider} provider
     * @returns {*}
     * @memberof IServiceInfo
     */
    get(provider: IServiceProvider): any;
}
export declare namespace Resolvers {
    interface IServiceInfoResolver {
        get(provider: IServiceProvider, key: any): IServiceInfo | undefined;
    }
    class EmptyServiceInfoResolver implements IServiceInfoResolver {
        get(provider: IServiceProvider, key: any): IServiceInfo | undefined;
    }
}
declare namespace Utils {
    class ChainMap<K, V> {
        private _maps;
        constructor(parents?: Array<Map<K, V>>);
        get(key: K): V | undefined;
        set(key: K, value: V): void;
        child(): ChainMap<K, V>;
    }
}
declare class ScopedServiceProvider implements IServiceProvider {
    private _services;
    constructor(_services: Utils.ChainMap<any, IServiceInfo>);
    get<V>(key: any): V | undefined;
    registerServiceInfo(key: any, serviceInfo: IServiceInfo): void;
    registerValue(key: any, value: any): void;
    register(key: any, factory: Factory, lifetime: LifeTime): void;
    registerTransient(key: any, factory: Factory): void;
    registerScoped(key: any, factory: Factory): void;
    registerSingleton(key: any, factory: Factory): void;
    registerGroup(key: any, keys: any[]): void;
    scope(): IServiceProvider;
}
/**
 * the main class for anyioc.
 *
 * @export
 * @class ServiceProvider
 * @extends {ScopedServiceProvider}
 */
export declare class ServiceProvider extends ScopedServiceProvider {
    constructor();
}
export declare const ioc: ServiceProvider;
export {};
//# sourceMappingURL=anyioc.d.ts.map