/// <reference path="../lib/loodash.js" />
/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../src/loader.js" />


describe("setupModuleLoader", function () {

    beforeEach(function () {
        delete window.angular;
        setupModuleLoader(window);
    });

    it('exposes angular on the window', function () {
        setupModuleLoader(window);
        expect(window.angular).toBeDefined();
    });

    it('creates angular just once', function () {
        setupModuleLoader(window);
        var ng = window.angular;
        setupModuleLoader(window);
        expect(window.angular).toBe(ng);
    });

    it('exposes the angular module function', function () {
        setupModuleLoader(window);
        expect(window.angular.module).toBeDefined();
    });

    it('exposes the angular module function just once', function () {
        setupModuleLoader(window);
        var module = window.angular.module;
        setupModuleLoader(window);
        expect(window.angular.module).toBe(module);
    });

    it('allows registering a module', function () {
        var myModule = window.angular.module('myModule', []);
        expect(myModule).toBeDefined();
        expect(myModule.name).toEqual('myModule');
    });

    it('replaces a module when registered with same name again', function () {
        var myModule = window.angular.module('myModule', []);
        var myNewModule = window.angular.module('myModule', []);
        expect(myNewModule).not.toBe(myModule);
    });

    it('attaches the requires array to the registered module', function () {
        var myModule = window.angular.module('myModule', ['myOtherModule']);
        expect(myModule.requires).toEqual(['myOtherModule']);
    });
});