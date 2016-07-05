/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/filter.js" />
/// <reference path="../src/injector.js" />
/// <reference path="../src/parse.js" />
/// <reference path="../src/scope.js" />
/// <reference path="../src/loader.js" />
/// <reference path="../src/q.js" />
/// <reference path="../src/compiler.js" />


function publishExternalAPI() {
    setupModuleLoader(window);
    var ngModule = window.angular.module('ng', []);

    ngModule.provider('$filter', $FilterProvider);
    ngModule.provider('$parse', $ParseProvider);
    ngModule.provider('$rootScope', $RootScopeProvider);
    ngModule.provider('$q', $QProvider);
    ngModule.provider('$compile', $CompileProvider);
}

