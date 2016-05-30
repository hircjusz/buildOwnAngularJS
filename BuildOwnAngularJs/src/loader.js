﻿function setupModuleLoader(window) {
    var ensure = function (obj, name, factory) {
        return obj[name] || (obj[name] = factory());
    };
    var angular = ensure(window, 'angular', Object);
    var createModule = function (name, requires,modules) {

        if (name === 'hasOwnProperty') {
            throw 'hasOwnProperty is not a valid module name';
        }
        var invokeQueue = [];
        var configBlocks = [];


        var invokeLater = function (service,method,arrayMethod,queue) {
            return function () {
                queue = queue || invokeQueue;
                var item = [service,method,arguments];
                invokeQueue[arrayMethod || 'push'](item);
                return moduleInstance;
            };
        };

        var moduleInstance = {
            name: name,
            requires: requires,
            constant: invokeLater('$provide','constant', 'unshift'),
            provider: invokeLater('$provide', 'provider'),
            config:invokeLater('$injector','invoke','push',configBlocks),
            _invokeQueue:invokeQueue
        };
        modules[name] = moduleInstance;
        return moduleInstance;
    };


    ensure(angular, 'module', function () {
        var modules = {};

        var getModule = function (name, modules) {
            if (modules.hasOwnProperty(name)) {
                return modules[name];
            } else {
                throw 'Module ' + name + ' is not available';
            }
        };

        return function (name, requires) {
            if (requires) {
                return createModule(name, requires,modules);
            } else {
                return getModule(name, modules);
            }


        };
    });
}