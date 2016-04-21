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
});


