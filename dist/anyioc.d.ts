export declare const Symbols: {
    Provider: symbol;
    RootProvider: symbol;
    Cache: symbol;
    MissingResolver: symbol;
};
export interface IServiceProvider {
    get<V>(key: any): V;
    scope(): IServiceProvider;
}
export declare type Factory = (provider: IServiceProvider) => any;
export declare enum LifeTime {
    Transient = 0,
    Scoped = 1,
    Singleton = 2
}
export declare namespace Service {
    interface IServiceInfo {
        get(provider: IServiceProvider): any;
    }
    class ServiceInfo implements IServiceInfo {
        private _factory;
        private _lifetime;
        private _cache_value;
        constructor(_factory: Factory, _lifetime: LifeTime);
        get(provider: IServiceProvider): any;
    }
    class ProviderServiceInfo implements IServiceInfo {
        get(provider: IServiceProvider): IServiceProvider;
    }
    class ValueServiceInfo implements IServiceInfo {
        private _value;
        constructor(_value: any);
        get(provider: IServiceProvider): any;
    }
    class GroupedServiceInfo implements IServiceInfo {
        private _keys;
        constructor(_keys: any[]);
        get(provider: IServiceProvider): {}[];
    }
}
export declare namespace Missing {
    interface IMissingResolver {
        get(provider: IServiceProvider, key: any): any;
    }
    class MissingResolver implements IMissingResolver {
        get(provider: IServiceProvider, key: any): any;
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
    constructor(_services: Utils.ChainMap<any, Service.IServiceInfo>);
    get<V>(key: any): V;
    registerServiceInfo(key: any, serviceInfo: Service.IServiceInfo): void;
    registerValue(key: any, value: any): void;
    register(key: any, factory: Factory, lifetime: LifeTime): void;
    registerTransient(key: any, factory: Factory): void;
    registerScoped(key: any, factory: Factory): void;
    registerSingleton(key: any, factory: Factory): void;
    scope(): IServiceProvider;
}
export declare class ServiceProvider extends ScopedServiceProvider {
    constructor();
}
export {};
//# sourceMappingURL=anyioc.d.ts.map