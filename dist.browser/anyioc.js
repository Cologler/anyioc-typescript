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
/* WEBPACK VAR INJECTION */(function(global) {
/* Copyright (c) 2018~2999 - Cologler <skyoflw@gmail.com> */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioc = exports.ServiceProvider = exports.Resolvers = exports.LifeTime = exports.Symbols = void 0;
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
var Services;
(function (Services) {
    class ServiceInfo {
        constructor(_factory, _lifetime, _provider) {
            this._factory = _factory;
            this._lifetime = _lifetime;
            this._provider = _provider;
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
                        this._cache_value = [this._factory(this._provider)];
                    }
                    return this._cache_value[0];
            }
        }
    }
    Services.ServiceInfo = ServiceInfo;
    class ProviderServiceInfo {
        get(provider) {
            return provider;
        }
    }
    Services.ProviderServiceInfo = ProviderServiceInfo;
    class ValueServiceInfo {
        constructor(_value) {
            this._value = _value;
        }
        get(provider) {
            return this._value;
        }
    }
    Services.ValueServiceInfo = ValueServiceInfo;
    class GroupedServiceInfo {
        constructor(_keys) {
            this._keys = _keys;
        }
        get(provider) {
            return this._keys.map(key => provider.get(key));
        }
    }
    Services.GroupedServiceInfo = GroupedServiceInfo;
    class BindedServiceInfo {
        constructor(_targetKey) {
            this._targetKey = _targetKey;
        }
        get(provider) {
            return provider.get(this._targetKey);
        }
    }
    Services.BindedServiceInfo = BindedServiceInfo;
})(Services || (Services = {}));
var Resolvers;
(function (Resolvers) {
    class EmptyServiceInfoResolver {
        get(provider, key) {
            return undefined;
        }
    }
    Resolvers.EmptyServiceInfoResolver = EmptyServiceInfoResolver;
})(Resolvers = exports.Resolvers || (exports.Resolvers = {}));
var Utils;
(function (Utils) {
    // value of ChainMap is IServiceInfo, it cannot be undefined.
    class ChainMap {
        constructor(parentMaps = null) {
            this._maps = [new Map()];
            this._maps.push(...parentMaps || []);
        }
        get(key) {
            for (const map of this._maps) {
                const list = map.get(key);
                if (list !== undefined) {
                    return list[list.length - 1];
                }
            }
            return undefined;
        }
        getMany(key) {
            const items = [];
            for (const map of this._maps) {
                const list = map.get(key);
                if (list !== undefined) {
                    items.push(...list.slice().reverse());
                }
            }
            return items;
        }
        set(key, value) {
            const map = this._maps[0];
            let list = map.get(key);
            if (list === undefined) {
                list = [];
                map.set(key, list);
            }
            list.push(value);
        }
        child() {
            return new ChainMap(this._maps);
        }
    }
    Utils.ChainMap = ChainMap;
    class ResolveStack {
        constructor() {
            this._resolveStack = new Set();
        }
        with(key, resolver) {
            if (this._resolveStack.has(key)) {
                const chain = [...this._resolveStack, key].join(' => ');
                throw new Error(`Recursive detected. Chain: ${chain}`);
            }
            this._resolveStack.add(key);
            try {
                return resolver();
            }
            finally {
                this._resolveStack.delete(key);
            }
        }
    }
    Utils.ResolveStack = ResolveStack;
})(Utils || (Utils = {}));
class ScopedServiceProvider {
    constructor(_services) {
        this._services = _services;
        this._resolveStack = new Utils.ResolveStack();
        this.registerValue(exports.Symbols.Cache, new Map());
    }
    _getServiceInfo(key) {
        let serviceInfo = this._services.get(key);
        if (serviceInfo === undefined) {
            const resolverServiceInfo = this._services.get(exports.Symbols.MissingResolver);
            const resolver = resolverServiceInfo.get(this);
            serviceInfo = resolver.get(this, key);
        }
        return serviceInfo;
    }
    _getServiceInfos(key) {
        return this._services.getMany(key);
    }
    get(key) {
        const serviceInfo = this._getServiceInfo(key);
        if (serviceInfo) {
            return this._resolveStack.with(key, () => serviceInfo.get(this));
        }
        return undefined;
    }
    getRequired(key) {
        const value = this.get(key);
        if (value === undefined) {
            throw new Error('unable to resolve the service');
        }
        return value;
    }
    getMany(key) {
        const serviceInfos = this._getServiceInfos(key);
        return this._resolveStack.with(key, () => serviceInfos.map(si => si.get(this)));
        ;
    }
    registerServiceInfo(key, serviceInfo) {
        this._services.set(key, serviceInfo);
    }
    registerValue(key, value) {
        this._services.set(key, new Services.ValueServiceInfo(value));
    }
    register(key, factory, lifetime) {
        this._services.set(key, new Services.ServiceInfo(factory, lifetime, this));
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
    registerGroup(key, keys) {
        this._services.set(key, new Services.GroupedServiceInfo(keys));
    }
    registerBind(key, target) {
        this._services.set(key, new Services.BindedServiceInfo(target));
    }
    scope() {
        return new ScopedServiceProvider(this._services.child());
    }
}
/**
 * the main class for anyioc.
 *
 * @export
 * @class ServiceProvider
 * @extends {ScopedServiceProvider}
 */
class ServiceProvider extends ScopedServiceProvider {
    constructor() {
        super(new Utils.ChainMap());
        this.registerServiceInfo(exports.Symbols.Provider, new Services.ProviderServiceInfo());
        this.registerValue(exports.Symbols.RootProvider, this);
        this.registerValue(exports.Symbols.MissingResolver, new Resolvers.EmptyServiceInfoResolver());
        // alias
        this.registerTransient('ioc', ioc => ioc.get(exports.Symbols.Provider));
        this.registerTransient('provider', ioc => ioc.get(exports.Symbols.Provider));
    }
}
exports.ServiceProvider = ServiceProvider;
// gist: a85a89bcdc9445148ce213a3d31eeeb2
function getGlobal() {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    else if (typeof window !== 'undefined') {
        return window; // browser
    }
    else if (typeof global != 'undefined') {
        return global; // node
    }
    else {
        throw Error('unknown');
    }
}
const iocSymbol = Symbol.for('anyioc://ioc');
exports.ioc = (function () {
    const g = getGlobal();
    if (g[iocSymbol] === undefined) {
        g[iocSymbol] = new ServiceProvider();
    }
    return g[iocSymbol];
})();
//# sourceMappingURL=anyioc.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/.pnpm/webpack@4.43.0_webpack@4.43.0/node_modules/webpack/buildin/global.js */ "./node_modules/.pnpm/webpack@4.43.0_webpack@4.43.0/node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/.pnpm/webpack@4.43.0_webpack@4.43.0/node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });
//# sourceMappingURL=anyioc.js.map