"use strict";
/* Copyright (c) 2018~2999 - Cologler <skyoflw@gmail.com> */
const Symbols = {
    Provider: Symbol('Provider'),
    RootProvider: Symbol('RootProvider'),
    Cache: Symbol('Cache'),
    MissingResolver: Symbol('MissingResolver'),
};
var Service;
(function (Service) {
    let LifeTime;
    (function (LifeTime) {
        LifeTime[LifeTime["Transient"] = 0] = "Transient";
        LifeTime[LifeTime["Scoped"] = 1] = "Scoped";
        LifeTime[LifeTime["Singleton"] = 2] = "Singleton";
    })(LifeTime = Service.LifeTime || (Service.LifeTime = {}));
    class ServiceInfo {
        constructor(_factory, _lifetime) {
            this._factory = _factory;
            this._lifetime = _lifetime;
            this._cache_value = null;
        }
        get(provider) {
            switch (this._lifetime) {
                case LifeTime.Transient:
                    return this._factory(provider);
                case LifeTime.Scoped:
                    const cache = provider.get(Symbols.Cache);
                    if (!cache.has(this)) {
                        cache.set(this, this._factory(provider));
                    }
                    return cache.get(this);
                case LifeTime.Singleton:
                    if (this._cache_value === null) {
                        provider = provider.get(Symbols.RootProvider);
                        this._cache_value = [this._factory(provider)];
                    }
                    return this._cache_value[0];
            }
        }
    }
    Service.ServiceInfo = ServiceInfo;
    class ProviderServiceInfo {
        get(provider) {
            return provider;
        }
    }
    Service.ProviderServiceInfo = ProviderServiceInfo;
    class ValueServiceInfo {
        constructor(_value) {
            this._value = _value;
        }
        get(provider) {
            return this._value;
        }
    }
    Service.ValueServiceInfo = ValueServiceInfo;
    class GroupedServiceInfo {
        constructor(_keys) {
            this._keys = _keys;
        }
        get(provider) {
            return this._keys.map(key => provider.get(key));
        }
    }
    Service.GroupedServiceInfo = GroupedServiceInfo;
})(Service || (Service = {}));
var Missing;
(function (Missing) {
    class MissingResolver {
        get(provider, key) {
            throw new Error('ServiceNotFoundError');
        }
    }
    Missing.MissingResolver = MissingResolver;
})(Missing || (Missing = {}));
var Utils;
(function (Utils) {
    class ChainMap {
        constructor(parents = []) {
            this._maps = [new Map()];
            this._maps.push(...parents);
        }
        get(key) {
            for (const map of this._maps) {
                if (map.has(key)) {
                    return map.get(key);
                }
            }
            return undefined;
        }
        set(key, value) {
            this._maps[0].set(key, value);
        }
    }
    Utils.ChainMap = ChainMap;
})(Utils || (Utils = {}));
class ScopedServiceProvider {
    constructor(_services) {
        this._services = _services;
        this._services.set(Symbols.Cache, new Service.ValueServiceInfo(new Map()));
    }
    get(key) {
        const serviceInfo = this._services.get(key);
        if (serviceInfo) {
            return serviceInfo.get(this);
        }
        const resolverServiceInfo = this._services.get(Symbols.MissingResolver);
        const resolver = resolverServiceInfo.get(this);
        return resolver.get(this, key);
    }
    registerServiceInfo(key, serviceInfo) {
        this._services.set(key, serviceInfo);
    }
    registerValue(key, value) {
        this._services.set(key, new Service.ValueServiceInfo(value));
    }
    register(key, factory, lifetime) {
        this._services.set(key, new Service.ServiceInfo(factory, lifetime));
    }
    registerTransient(key, factory) {
        return this.register(key, factory, Service.LifeTime.Transient);
    }
    registerScoped(key, factory) {
        return this.register(key, factory, Service.LifeTime.Scoped);
    }
    registerSingleton(key, factory) {
        return this.register(key, factory, Service.LifeTime.Singleton);
    }
}
class ServiceProvider extends ScopedServiceProvider {
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
