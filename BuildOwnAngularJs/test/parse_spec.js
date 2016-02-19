/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../src/parse.js" />
/// <reference path="../lib/loodash.js" />

'use strict';

describe("parse", function () {
    it("can parse an integer", function () {
        var fn = parse('42');
        expect(fn).toBeDefined();
        expect(fn()).toBe(42);
    });
});