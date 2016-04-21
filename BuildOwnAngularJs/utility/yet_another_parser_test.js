/// <reference path="../lib/loodash.js" />
/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../utility/yet_another_parser.js" />

describe("Yet another parser", function() {

    describe("parserT", function() {
        
        it("function isWhiteSpace", function () {

            expect(isWhiteSpace(' ')).toBe(true);
        });

        it("function isDecimal", function () {

            expect(isDecimalDigit('9')).toBe(true);
        });




    });

});