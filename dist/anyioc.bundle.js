var anyioc =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./dist/anyioc.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./dist/anyioc.js":
/*!************************!*\
  !*** ./dist/anyioc.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* Copyright (c) 2018~2999 - Cologler <skyoflw@gmail.com> */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbols = {
    Provider: Symbol('Provider'),
    RootProvider: Symbol('RootProvider'),
    Cache: Symbol('Cache'),
    MissingResolver: Symbol('MissingResolver'),
};
var LifeTime;
(function (LifeTime) {
    LifeTime[LifeTime["Transient"] = 0] = "Transient";
    LifeTime[LifeTime["Scoped"] = 1] = "Scoped";
    LifeTime[LifeTime["Singleton"] = 2] = "Singleton";
})(LifeTime = exports.LifeTime || (exports.LifeTime = {}));
var Service;
(function (Service) {
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
                    const cache = provider.get(exports.Symbols.Cache);
                    if (!cache.has(this)) {
                        cache.set(this, this._factory(provider));
                    }
                    return cache.get(this);
                case LifeTime.Singleton:
                    if (this._cache_value === null) {
                        provider = provider.get(exports.Symbols.RootProvider);
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
})(Service = exports.Service || (exports.Service = {}));
var Missing;
(function (Missing) {
    class MissingResolver {
        get(provider, key) {
            throw new Error('ServiceNotFoundError');
        }
    }
    Missing.MissingResolver = MissingResolver;
})(Missing = exports.Missing || (exports.Missing = {}));
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
        child() {
            return new ChainMap(this._maps);
        }
    }
    Utils.ChainMap = ChainMap;
})(Utils || (Utils = {}));
class ScopedServiceProvider {
    constructor(_services) {
        this._services = _services;
        this._services.set(exports.Symbols.Cache, new Service.ValueServiceInfo(new Map()));
    }
    get(key) {
        const serviceInfo = this._services.get(key);
        if (serviceInfo) {
            return serviceInfo.get(this);
        }
        const resolverServiceInfo = this._services.get(exports.Symbols.MissingResolver);
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
        return this.register(key, factory, LifeTime.Transient);
    }
    registerScoped(key, factory) {
        return this.register(key, factory, LifeTime.Scoped);
    }
    registerSingleton(key, factory) {
        return this.register(key, factory, LifeTime.Singleton);
    }
    scope() {
        return new ScopedServiceProvider(this._services.child());
    }
}
class ServiceProvider extends ScopedServiceProvider {
    constructor() {
        super(new Utils.ChainMap());
        this.registerServiceInfo(exports.Symbols.Provider, new Service.ProviderServiceInfo());
        this.registerValue(exports.Symbols.RootProvider, this);
        this.registerValue(exports.Symbols.MissingResolver, new Missing.MissingResolver());
        // alias
        this.registerTransient('ioc', ioc => ioc.get(exports.Symbols.Provider));
        this.registerTransient('provider', ioc => ioc.get(exports.Symbols.Provider));
        this.registerTransient('service_provider', ioc => ioc.get(exports.Symbols.Provider));
    }
}
exports.ServiceProvider = ServiceProvider;
//# sourceMappingURL=anyioc.js.map

/***/ })

/******/ });
//# sourceMappingURL=anyioc.bundle.js.map