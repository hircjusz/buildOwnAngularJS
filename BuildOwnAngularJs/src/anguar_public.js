/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/filter.js" />
/// <reference path="../src/injector.js" />
/// <reference path="../src/parse.js" />
/// <reference path="../src/loader.js" />


function publishExternalAPI() {
    setupModuleLoader(window);
    var ngModule = window.angular.module('ng', []);

    ngModule.provider('$filter', $FilterProvider);
    ngModule.provider('$parse', $ParseProvider);
}

