/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../src/filter.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/parse.js" />


describe("filters", function() {
    it('can be registered and obtained', function () {
        var myFilter = function () { };
        var myFilterFactory = function () {
            return myFilter;
        };
        register('my', myFilterFactory);
        expect(filter('my')).toBe(myFilter);
    });

    it('allows registering multiple filters with an object', function () {
        var myFilter = function () { };
        var myOtherFilter = function () { };
        register({
            my: function () {
                return myFilter;
            },
            myOther: function () {
                return myOtherFilter;
            }
        });
        expect(filter('my')).toBe(myFilter);
        expect(filter('myOther')).toBe(myOtherFilter);
    });

    it('can parse filter expressions', function () {
        register('upcase', function () {
            return function (str) {
                return str.toUpperCase();
            };
        });
        var fn = parse('aString | upcase');
        expect(fn({ aString: 'Hello' })).toEqual('HELLO');
    });
    it('can parse filter chain expressions', function () {
        register('upcase', function () {
            return function (s) {
                return s.toUpperCase();
            };
        });
        register('exclamate', function () {
            return function (s) {
                return s + '!';
            };
        });
        var fn = parse('"hello" | upcase | exclamate');
        expect(fn()).toEqual('HELLO!');
    });
});