/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/filter.js" />
/// <reference path="../src/injector.js" />
/// <reference path="../src/parse.js" />
/// <reference path="../src/scope.js" />
/// <reference path="../src/loader.js" />
/// <reference path="../src/q.js" />
/// <reference path="../src/compiler.js" />
/// <reference path="../src/anguar_public.js" />

describe('$compile', function () {
    beforeEach(function () {
        delete window.angular;
        publishExternalAPI();
    });
    it('allows creating directives', function () {
        var myModule = window.angular.module('myModule', []);
        myModule.directive('testing', function () { });
        var injector = createInjector(['ng', 'myModule']);
        expect(injector.has('testingDirective')).toBe(true);
    });

    it('allows creating many directives with the same name', function () {
        var myModule = window.angular.module('myModule', []);
        myModule.directive('testing', _.constant({ d: 'one' }));
        myModule.directive('testing', _.constant({ d: 'two' }));
        var injector = createInjector(['ng', 'myModule']);
        var result = injector.get('testingDirective');
        expect(result.length).toBe(2);
        expect(result[0].d).toEqual('one');
        expect(result[1].d).toEqual('two');
    });

    it('does not allow a directive called hasOwnProperty', function () {
        var myModule = window.angular.module('myModule', []);
        myModule.directive('hasOwnProperty', function () { });
        expect(function () {
            createInjector(['ng', 'myModule']);
        }).toThrow();
    });

    it('allows creating directives with object notation', function () {
        var myModule = window.angular.module('myModule', []);
        myModule.directive({
            a: function () { },
            b: function () { },
            c: function () { }
        });
        var injector = createInjector(['ng', 'myModule']);
        expect(injector.has('aDirective')).toBe(true);
        expect(injector.has('bDirective')).toBe(true);
        expect(injector.has('cDirective')).toBe(true);
    });
});