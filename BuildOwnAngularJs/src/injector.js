/// <reference path="../lib/loodash.js" />
'use strict';


function createInjector(modulesToLoad, strictDI) {
    var cache = {};
    var loadedModules = {};
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
            has: function(name) {
                return cache.hasOwnProperty(name) ||
                    providerCache.hasOwnProperty(name + 'Provider');
            },
            get: getService,
            annotate: annotate,
            invoke: invoke,
            instantiate:instantiate


        }
    }

    var providerInjector = providerCache.$injector  = createInternalInjector(providerCache, function() {
        throw 'Unknown provider' + path.join('<-');
    });

    var instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (name) {
        var provider = providerInjector.get(name + 'Provider');
        return instanceInjector.invoke(provider.$get, provider);
    });



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
        }
    };


    _.forEach(modulesToLoad, function loadModule(moduleName) {
        if (!loadedModules.hasOwnProperty(moduleName)) {
            loadedModules[moduleName] = true;
            var module = window.angular.module(moduleName);
            _.forEach(module.requires, loadModule);
            _.forEach(module._invokeQueue, function (invokeArgs) {

                var method = invokeArgs[0];
                var args = invokeArgs[1];
                providerCache.$provide[method].apply(providerCache.$provide, args);

            });
        }
    });


   return instanceInjector;
}