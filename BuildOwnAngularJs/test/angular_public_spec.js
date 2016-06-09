/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../lib/loodash.js" />
/// <reference path="../src/loader.js" />
/// <reference path="../src/anguar_public.js" />


'use strict';

describe('angularPublic', function () {
    it('sets up the angular object and the module loader', function () {
        publishExternalAPI();
        expect(window.angular).toBeDefined();
        expect(window.angular.module).toBeDefined();
    });
});