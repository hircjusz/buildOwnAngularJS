/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/loader.js" />
/// <reference path="../src/injector.js" />
'use strict';

'use strict';

describe('injector', function () {
    beforeEach(function () {
        delete window.angular;
        setupModuleLoader(window);
    });

    it('can be created', function () {
        var injector = createInjector([]);
        expect(injector).toBeDefined();
    });

    it('has a constant that has been registered to a module', function () {
        var module = window.angular.module('myModule', []);
        module.constant('aConstant', 42);
        var injector = createInjector(['myModule']);
        expect(injector.has('aConstant')).toBe(true);
    });

    it('does not have a non-registered constant', function () {
        var module = window.angular.module('myModule', []);
        var injector = createInjector(['myModule']);
        expect(injector.has('aConstant')).toBe(false);
    });

    it('has a constant that has been registered to a module', function () {
        var module = window.angular.module('myModule', []);
        module.constant('aConstant', 42);
        var injector = createInjector(['myModule']);
        expect(injector.has('aConstant')).toBe(true);
    });

    it('does not have a non-registered constant', function () {
        var module = window.angular.module('myModule', []);
        var injector = createInjector(['myModule']);
        expect(injector.has('aConstant')).toBe(false);
    });


});


