﻿/// <reference path="../lib/loodash.js" />
/// <reference path="../src/hash_map.js" />
'use strict';


function createInjector(modulesToLoad, strictDI) {
    var cache = {};
    var loadedModules = new HashMap();
    var providerCache = {};
    var instanceCache = {};
    var strictDi = (strictDI === true);
    var path = [];



    function createInternalInjector(cache, factoryFn) {

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var STRIP_COMMENTS = /(\/\/.*$)|(\/\*.*?\*\/)/mg;
        var INSTANTIATING = {};


        function getService(name) {
            if (cache.hasOwnProperty(name)) {
                if (cache[name] === INSTANTIATING) {
                    throw new Error('Circular dependency found: ' +
                     name + ' <- ' + path.join(' <- '));
                }
                return cache[name];
            } else if (providerCache.hasOwnProperty(name)) {
                return providerCache[name];
            }
            else if (providerCache.hasOwnProperty(name + 'Provider')) {
                path.unshift(name);
                cache[name] = INSTANTIATING;
                try {
                    var provider = providerCache[name + 'Provider'];
                    var instance = instanceCache[name] = invoke(provider.$get);
                    return instance;
                } finally {
                    path.shift();
                    if (cache[name] === INSTANTIATING) {
                        delete cache[name];
                    }
                }
            }
        };

        function invoke(fn, self, locals) {

            var args = _.map(annotate(fn), function (token) {
                if (_.isString(token)) {
                    return locals && locals.hasOwnProperty(token) ?
                        locals[token] : getService(token);
                } else {
                    throw 'Incorrect injected token. Expected string but got ' + token;
                }
            });

            if (_.isArray(fn)) {
                fn = _.last(fn);
            }
            return fn.apply(self, args);
        };
        function instantiate(Type, locals) {
            var UnwrappedType = _.isArray(Type) ? _.last(Type) : Type;
            var instance = Object.create(UnwrappedType.prototype);
            invoke(Type, instance, locals);
            return instance;
        }

        function annotate(fn) {
            if (_.isArray(fn)) {
                return fn.slice(0, fn.length - 1);
            } else if (fn.$inject) {
                return fn.$inject;
            } else if (!fn.length) {
                return [];
            } else {
                if (strictDi) {
                    throw 'fn is not using explicit annotation and ' +
                    'cannot be invoked in strict mode';
                }
                var source = fn.toString().replace(STRIP_COMMENTS, '');
                var argDeclaration = source.match(FN_ARGS);
                return _.map(argDeclaration[1].split(','), function (argName) {
                    return argName.match(FN_ARG)[2];
                });
            }
        }

        return {
            has: function (name) {
                return cache.hasOwnProperty(name) ||
                    providerCache.hasOwnProperty(name + 'Provider');
            },
            get: getService,
            annotate: annotate,
            invoke: invoke,
            instantiate: instantiate


        }
    }

    var providerInjector = providerCache.$injector = createInternalInjector(providerCache, function () {
        throw 'Unknown provider' + path.join('<-');
    });

    var instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (name) {
        var provider = providerInjector.get(name + 'Provider');
        return instanceInjector.invoke(provider.$get, provider);
    });


    function enforceReturnValue(factoryFn) {
        return function () {
            var value = instanceInjector.invoke(factoryFn);
            if (_.isUndefined(value)) {
                throw 'factory must return a value';
            }
            return value;
        };
    }


    providerCache.$provide = {
        constant: function (key, value) {
            if (key === 'hasOwnProperty') {
                throw 'hasOwnProperty is not a valid constant name';
            }

            instanceCache[key] = value;
        },
        provider: function (key, provider) {
            if (_.isFunction(provider)) {
                provider = providerInjector.instantiate(provider);
            }
            providerCache[key + 'Provider'] = provider;
        },
        factory: function (key, factoryFn, enforce) {
            this.provider(key, {
                $get: enforce === false ? factoryFn : enforceReturnValue(factoryFn)
            });
        },
        value: function (key, value) {
            this.factory(key, _.constant(value), false);
        },service: function(key, Constructor) {
            this.factory(key, function () {
                return instanceInjector.instantiate(Constructor);
            });
        },
        decorator: function (serviceName, decoratorFn) {
            var provider = providerInjector.get(serviceName + 'Provider');
            var original$get = provider.$get;
            provider.$get = function () {
                var instance = instanceInjector.invoke(original$get, provider);
                instanceInjector.invoke(decoratorFn, null, { $delegate: instance });
                return instance;
            };
        }
    };

    function runInvokeQueue(queue) {
        _.forEach(queue, function (invokeArgs) {
            var service = providerInjector.get(invokeArgs[0]);
            var method = invokeArgs[1];
            var args = invokeArgs[2];
            service[method].apply(service, args);
        });

    }
    var runBlocks = [];

    _.forEach(modulesToLoad, function loadModule(module) {
        if (_.isString(module)) {
            if (!loadedModules.get(module)) {
                loadedModules.put(module,true);
                module = window.angular.module(module);
                _.forEach(module.requires, loadModule);
                runInvokeQueue(module._invokeQueue);
                runInvokeQueue(module._configBlocks);
                runBlocks = runBlocks.concat(module._runBlocks);

            }
        } else if (_.isFunction(module) || _.isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
        }
    });

    _.forEach(_.compact(runBlocks), function (runBlock) {
        if (runBlock) {
            instanceInjector.invoke(runBlock);
        }
    });


    return instanceInjector;
}