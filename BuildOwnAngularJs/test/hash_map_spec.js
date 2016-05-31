/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/hash_map.js" />

describe('hash', function () {
    'use strict';
    describe('hashKey', function () {
        it('is undefined:undefined for undefined', function () {
            expect(hashKey(undefined)).toEqual('undefined:undefined');
        });
    });
});