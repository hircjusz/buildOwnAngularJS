/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/filter.js" />
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

    it('can pass an additional argument to filters', function () {
        register('repeat', function () {
            return function (s, times) {
                return _.repeat(s, times);
            };
        });
        var fn = parse('"hello" | repeat:3');
        expect(fn()).toEqual('hellohellohello');
    });

    it('can pass several additional arguments to filters', function () {
        register('surround', function () {
            return function (s, left, right) {
                return left + s + right;
            };
        });
        var fn = parse('"hello" | surround:"*":"!"');
        expect(fn()).toEqual('*hello!');
    });


    describe("filter filter", function () {
        it('is available', function () {
            expect(filter('filter')).toBeDefined();
        });
    });

    it('can filter an array with a predicate function', function () {
        var fn = parse('[1, 2, 3, 4] | filter:isOdd');
        var scope = {
            isOdd: function (n) {
                return n % 2 !== 0;
            }
        };
        expect(fn(scope)).toEqual([1, 3]);
    });

    it('can filter an array of strings with a string', function () {
        var fn = parse('arr | filter:"a"');
        expect(fn({ arr: ["a", "b", "a"] })).toEqual(['a', 'a']);
    });

    it('filters an array of strings with substring matching', function () {
        var fn = parse('arr | filter:"o"');
        expect(fn({ arr: ['quick', 'brown', 'fox'] })).toEqual(['brown', 'fox']);
    });

    it('filters an array of objects where any value matches', function () {
        var fn = parse('arr | filter:"o"');
        expect(fn({
            arr: [
            { firstName: 'John', lastName: 'Brown' },
            { firstName: 'Jane', lastName: 'Fox' },
            { firstName: 'Mary', lastName: 'Quick' }
            ]
        })).toEqual([
        { firstName: 'John', lastName: 'Brown' },
        { firstName: 'Jane', lastName: 'Fox' }
        ]);
    });

    it('filters with a number', function () {
        var fn = parse('arr | filter:42');
        expect(fn({
            arr: [
            { name: 'Mary', age: 42 },
            { name: 'John', age: 43 },
            { name: 'Jane', age: 44 }
            ]
        })).toEqual([
        { name: 'Mary', age: 42 }
        ]);
    });

    it('filters with a number', function () {
        var fn = parse('arr | filter:42');
        expect(fn({
            arr: [
            { name: 'Mary', age: 42 },
            { name: 'John', age: 43 },
            { name: 'Jane', age: 44 }
            ]
        })).toEqual([
        { name: 'Mary', age: 42 }
        ]);
    });

    it('filters with a substring numeric value', function () {
        var fn = parse('arr | filter:42');
        expect(fn({ arr: ['contains 42'] })).toEqual(['contains 42']);
    });

    it('filters matching null', function () {
        var fn = parse('arr | filter:null');
        expect(fn({ arr: [null, 'not null'] })).toEqual([null]);
    });
    it('does not match null value with the string null', function () {
        var fn = parse('arr | filter:"null"');
        expect(fn({ arr: [null, 'not null'] })).toEqual(['not null']);
    });

    it('does not match undefined values', function () {
        var fn = parse('arr | filter:"undefined"');
        expect(fn({ arr: [undefined, 'undefined'] })).toEqual(['undefined']);
    });

    it('allows negating string filter', function () {
        var fn = parse('arr | filter:"!o"');
        expect(fn({ arr: ['quick', 'brown', 'fox'] })).toEqual(['quick']);
    });

    it('filters with an object', function () {
        var fn = parse('arr | filter:{name: "o"}');
        expect(fn({
            arr: [
            { name: 'Joe', role: 'admin' },
            { name: 'Jane', role: 'moderator' }
            ]
        })).toEqual([
        { name: 'Joe', role: 'admin' }
        ]);
    });

    it('must match all criteria in an object', function () {
        var fn = parse('arr | filter:{name: "o", role: "m"}');
        expect(fn({
            arr: [
            { name: 'Joe', role: 'admin' },
            { name: 'Jane', role: 'moderator' }
            ]
        })).toEqual([
        { name: 'Joe', role: 'admin' }
        ]);
    });

    it('matches everything when filtered with an empty object', function () {
        var fn = parse('arr | filter:{}');
        expect(fn({
            arr: [
            { name: 'Joe', role: 'admin' },
            { name: 'Jane', role: 'moderator' }
            ]
        })).toEqual([
        { name: 'Joe', role: 'admin' },
        { name: 'Jane', role: 'moderator' }
        ]);
    });

    it('filters with a nested object', function () {
        var fn = parse('arr | filter:{name: {first: "o"}}');
        expect(fn({
            arr: [
            { name: { first: 'Joe' }, role: 'admin' },
            { name: { first: 'Jane' }, role: 'moderator' }
            ]
        })).toEqual([
        { name: { first: 'Joe' }, role: 'admin' }
        ]);
    });

    it('filters with a nested object', function () {
        var fn = parse('arr | filter:{name: {first: "o"}}');
        expect(fn({
            arr: [
            { name: { first: 'Joe' }, role: 'admin' },
            { name: { first: 'Jane' }, role: 'moderator' }
            ]
        })).toEqual([
        { name: { first: 'Joe' }, role: 'admin' }
        ]);
    });

    it('ignores undefined values in expectation object', function () {
        var fn = parse('arr | filter:{name: thisIsUndefined}');
        expect(fn({
            arr: [
            { name: 'Joe', role: 'admin' },
            { name: 'Jane', role: 'moderator' }
            ]
        })).toEqual([
        { name: 'Joe', role: 'admin' },
        { name: 'Jane', role: 'moderator' }
        ]);
    });

    it('filters with a nested object in array', function () {
        var fn = parse('arr | filter:{users: {name: {first: "o"}}}');
        expect(fn({
            arr: [
            {
                users: [{ name: { first: 'Joe' }, role: 'admin' },
                { name: { first: 'Jane' }, role: 'moderator' }]
            },
            { users: [{ name: { first: 'Mary' }, role: 'admin' }] }
            ]
        })).toEqual([
        {
            users: [{ name: { first: 'Joe' }, role: 'admin' },
            { name: { first: 'Jane' }, role: 'moderator' }]
        }
        ]);
    });

    it('filters with nested objects on the same level only', function () {
        var items = [{ user: 'Bob' },
        { user: { name: 'Bob' } },
        { user: { name: { first: 'Bob', last: 'Fox' } } }];
        var fn = parse('arr | filter:{user: {name: "Bob"}}');
        expect(fn({
            arr: [
            { user: 'Bob' },
            { user: { name: 'Bob' } },
            { user: { name: { first: 'Bob', last: 'Fox' } } }
            ]
        })).toEqual([
        { user: { name: 'Bob' } }
        ]);
    });

    it('filters with a wildcard property', function () {
        var fn = parse('arr | filter:{$: "o"}');
        expect(fn({
            arr: [
            { name: 'Joe', role: 'admin' },
            { name: 'Jane', role: 'moderator' },
            { name: 'Mary', role: 'admin' }
            ]
        })).toEqual([
        { name: 'Joe', role: 'admin' },
        { name: 'Jane', role: 'moderator' }
        ]);
    });

    it('filters nested objects with a wildcard property', function () {
        var fn = parse('arr | filter:{$: "o"}');
        expect(fn({
            arr: [
            { name: { first: 'Joe' }, role: 'admin' },
            { name: { first: 'Jane' }, role: 'moderator' },
            { name: { first: 'Mary' }, role: 'admin' }
            ]
        })).toEqual([
        { name: { first: 'Joe' }, role: 'admin' },
        { name: { first: 'Jane' }, role: 'moderator' }
        ]);
    });

    it('filters wildcard properties scoped to parent', function () {
        var fn = parse('arr | filter:{name: {$: "o"}}');
        expect(fn({
            arr: [
            { name: { first: 'Joe', last: 'Fox' }, role: 'admin' },
            { name: { first: 'Jane', last: 'Quick' }, role: 'moderator' },
            { name: { first: 'Mary', last: 'Brown' }, role: 'admin' }
            ]
        })).toEqual([
        { name: { first: 'Joe', last: 'Fox' }, role: 'admin' },
        { name: { first: 'Mary', last: 'Brown' }, role: 'admin' }
        ]);
    });

    it('allows using a custom comparator', function () {
        var fn = parse('arr | filter:{$: "o"}:myComparator');
        expect(fn({
            arr: ['o', 'oo', 'ao', 'aa'],
            myComparator: function (left, right) {
                return left === right;
            }
        })).toEqual(['o']);
    });

    it('allows using an equality comparator', function () {
        var fn = parse('arr | filter:{name: "Jo"}:true');
        expect(fn({
            arr: [
            { name: "Jo" },
            { name: "Joe" }
            ]
        })).toEqual([
        { name: "Jo" }
        ]);
    });



});