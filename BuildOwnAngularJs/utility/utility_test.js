﻿/// <reference path="../lib/loodash.js" />
/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../utility/utility.js" />

describe("Utility", function () {

    describe("Function", function () {

        it("function calls return 1", function () {
            var bodyFn = 'return 1';
            var fn = new Function('', bodyFn);
            expect(fn()).toBe(1);
        });

        it("function calls with arg return a", function () {
            var bodyFn = '{return a;}';
            var fn = new Function('a', bodyFn);
            expect(fn(1)).toBe(1);
        });

        it("function calls with 2 arguments return a", function () {
            var bodyFn = '{return a+b;}';
            var fn = new Function('a', 'b', bodyFn);
            expect(fn(1, 2)).toBe(3);
        });

        it("function calls with 2 arguments and vars return a", function () {
            var bodyFn = '{' +
                'var c=2;' +
                'return a+b+c;' +
                '}';
            var fn = new Function('a', 'b', bodyFn);
            expect(fn(1, 2)).toBe(5);
        });

        it("function calls internal function", function () {
            var fun = function() { return 1; };

            var bodyFn = ' var fn=function(a,b){return fun()+a+b;}; return fn;';
            var fn = new Function('fun', bodyFn)(fun);
            expect(fn(1, 2)).toBe(4);
        });

        it("function result push", function () {
            var result = [];
            result.push('a','b','c','d');
        });
    });

    describe("Array&&Objects", function () {

        it("objects to array", function () {
            var obj = { 0: 'a', 1: 'b', 2: 'c' };
            var arr = _.values(obj);
            expect(arr[0]).toBe(['a','b','c'][0]);
        });

        it("objects to plain obj", function () {
            var obj = { 0: 'a', 1: 'b', 2: 'c',3: { '3a': {} } };
            var t= _.toPlainObject(obj);
        });


    });

    describe("ccParser", function() {

        it("simple test", function () {
            var parser= new ccParser('xxxx');

            expect(1).toBe(1);
        });

    });


});