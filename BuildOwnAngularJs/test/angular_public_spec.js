/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/filter.js" />
/// <reference path="../src/injector.js" />
/// <reference path="../src/loader.js" />
/// <reference path="../src/parse.js" />
/// <reference path="../src/scope.js" />
/// <reference path="../src/q.js" />
/// <reference path="../src/anguar_public.js" />


'use strict';

describe('angularPublic', function () {
    it('sets up the angular object and the module loader', function () {
        publishExternalAPI();
        expect(window.angular).toBeDefined();
        expect(window.angular.module).toBeDefined();
    });

    it('sets up the ng module', function() {
        publishExternalAPI();

        expect(createInjector(['ng'])).toBeDefined();
    });

    it('sets up the $filter service', function () {
        publishExternalAPI();
        var injector = createInjector(['ng']);
        expect(injector.has('$filter')).toBe(true);
    });

    describe("filter", function() {

        beforeEach(function () {
            publishExternalAPI();
        });


        it('can be registered and obtained', function () {
            var myFilter = function() {};
            var myFilterFactory = function() {
                return myFilter;
            };
            var injector = createInjector([
                'ng', function($filterProvider) {
                    $filterProvider.register('my', myFilterFactory);
                }
            ]);
            var $filter = injector.get('$filter');
            expect($filter('my')).toBe(myFilter);
        });

        it('allows registering multiple filters with an object', function () {
            var myFilter = function () { };
            var myOtherFilter = function () { };
            var injector = createInjector(['ng', function ($filterProvider) {
                $filterProvider.register({
                    my: function () {
                        return myFilter;
                    },
                    myOther: function () {
                        return myOtherFilter;
                    }
                });
            }]);
            var $filter = injector.get('$filter');
            expect($filter('my')).toBe(myFilter);
            expect($filter('myOther')).toBe(myOtherFilter);
        });

        it('is available through injector', function() {
            var myFilter = function() { };
            var injector = createInjector(['ng', function($filterProvider) {
                $filterProvider.register('my', function () {
                    return myFilter;
                });
            }]);
            expect(injector.has('myFilter')).toBe(true);
            expect(injector.get('myFilter')).toBe(myFilter);
        });

        it('may have dependencies in factory', function () {
            var injector = createInjector(['ng', function ($provide, $filterProvider) {
                $provide.constant('suffix', '!');
                $filterProvider.register('my', function (suffix) {
                    return function (v) {
                        return suffix + v;
                    };
                });
            }]);
            expect(injector.has('myFilter')).toBe(true);
        });

        it('can be registered through module API', function () {
            var myFilter = function () { };
            var module = window.angular.module('myModule', [])
            .filter('my', function () {
                return myFilter;
            });
            var injector = createInjector(['ng', 'myModule']);
            expect(injector.has('myFilter')).toBe(true);
            expect(injector.get('myFilter')).toBe(myFilter);
        });

        it('is available', function () {
            var injector = createInjector(['ng']);
            expect(injector.has('filterFilter')).toBe(true);
        });

        it('sets up the $parse service', function () {
            publishExternalAPI();
            var injector = createInjector(['ng']);
            expect(injector.has('$parse')).toBe(true);
        });


    });

    describe("parse", function() {
        var parse;
        beforeEach(function() {
            publishExternalAPI();
            parse = createInjector(['ng']).get('$parse');
        });

        it('can parse filter expressions', function () {
            parse = createInjector(['ng', function ($filterProvider) {
                $filterProvider.register('upcase', function () {
                    return function (str) {
                        return str.toUpperCase();
                    };
                });
            }]).get('$parse');
            var fn = parse('aString | upcase');
            expect(fn({ aString: 'Hello' })).toEqual('HELLO');
        });

        it('can parse filter chain expressions', function() {
            parse = createInjector(['ng', function($filterProvider) {
                $filterProvider.register('upcase', function() {
                    return function(s) {
                        return s.toUpperCase();
                    };
                });
                $filterProvider.register('exclamate', function () {
                    return function (s) {
                        return s + '!';
                    };
                });
            }]).get('$parse');
            var fn = parse('"hello" | upcase | exclamate');
            expect(fn()).toEqual('HELLO!');
        });

        it('can pass an additional argument to filters', function () {
            parse = createInjector(['ng', function ($filterProvider) {
                $filterProvider.register('repeat', function () {
                    return function (s, times) {
                        return _.repeat(s, times);
                    };
                });
            }]).get('$parse');
            var fn = parse('"hello" | repeat:3');
            expect(fn()).toEqual('hellohellohello');
        });

        it('can pass several additional arguments to filters', function () {
            parse = createInjector(['ng', function ($filterProvider) {
                $filterProvider.register('surround', function () {
                    return function (s, left, right) {
                        return left + s + right;
                    };
                });
            }]).get('$parse');
            var fn = parse('"hello" | surround:"*":"!"');
            expect(fn()).toEqual('*hello!');
        });

        it('marks filters constant if arguments are', function () {
            parse = createInjector(['ng', function ($filterProvider) {
                $filterProvider.register('aFilter', function () {
                    return _.identity;
                });
            }]).get('$parse');
            expect(parse('[1, 2, 3] | aFilter').constant).toBe(true);
            expect(parse('[1, 2, a] | aFilter').constant).toBe(false);
            expect(parse('[1, 2, 3] | aFilter:42').constant).toBe(true);
            expect(parse('[1, 2, 3] | aFilter:a').constant).toBe(false);
        });

    });

    it('sets up the $rootScope', function () {
        publishExternalAPI();
        var injector = createInjector(['ng']);
        expect(injector.has('$rootScope')).toBe(true);
    });


    it('sets up $q', function () {
        publishExternalAPI();
        var injector = createInjector(['ng']);
        expect(injector.has('$q')).toBe(true);
    });


});