﻿/// <reference path="../lib/loodash.js" />
/// <reference path="../Scripts/jasmine.js" />
/// <reference path="../utility/yet_another_parser.js" />

describe("Yet another parser", function () {

    var scanner;
    beforeEach(function () {
        scanner = new Scanner();
    });
    describe("parserT", function () {

        it("function isWhiteSpace", function () {


            expect(scanner.isWhiteSpace(' ')).toBe(true);
        });

        it("function isDecimal", function () {

            expect(scanner.isDecimalDigit('9')).toBe(true);
        });

        it("function createToken", function () {

            var token = scanner.createToken('int', 9);

            expect(token).toEqual(jasmine.objectContaining({
                type: 'int',
                value: 9
            }));
        });


        it("function getNextChar 2-1", function () {
            scanner = new Scanner('abcdef');
            expect(scanner.index).toBe(0);
            expect(scanner.length).toBe(6);
            var ch=scanner.getNextChar();
            expect(ch).toBe('a');
            ch = scanner.getNextChar();
            expect(ch).toBe('b');
        });

        it("function peekNextChar-2", function () {
            scanner = new Scanner('abcdef');
            expect(scanner.index).toBe(0);
            expect(scanner.length).toBe(6);
            var ch = scanner.peekNextChar();
            expect(ch).toBe('a');
            ch = scanner.peekNextChar();
            expect(ch).toBe('a');
        });

        it("function skipSpaces", function () {
            scanner = new Scanner('    abcdef');
            expect(scanner.index).toBe(0);
            expect(scanner.length).toBe(10);
            var ch = scanner.skipSpaces();
            expect(scanner.index).toBe(4);
            
        });

        it("function scanOperator", function () {
            scanner = new Scanner('+-*/()');
            var token = scanner.scanOperator();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '+'
            }));
            token = scanner.scanOperator();

            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '-'
            }));

            token = scanner.scanOperator();

            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '*'
            }));

            token = scanner.scanOperator();

            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '/'
            }));
            token = scanner.scanOperator();

            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '('
            }));
            token = scanner.scanOperator();

            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: ')'
            }));
        });

        it("function scanIdentifier", function () {
            scanner = new Scanner('alpha');
            var token = scanner.scanIdentifier();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Identifier',
                value: 'alpha'
            }));
            scanner = new Scanner('a190');
             token = scanner.scanIdentifier();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Identifier',
                value: 'a190'
            }));


        });

        it("function scanNumber Integer", function () {
            scanner = new Scanner('20000');
            var token= scanner.scanNumber();

        });

        it("function scanNumber Float", function () {
            scanner = new Scanner('213.23');
            var token = scanner.scanNumber();
        });
        it("function scanNumber exponent", function () {
            scanner = new Scanner('213e5');
            var token = scanner.scanNumber();
        });


        it("function next exponent", function () {
            scanner = new Scanner('213e5 aaa a190 213.23 / *  -');
            var token;
            token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Number',
                value: 21300000
            }));

            token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Identifier',
                value: 'aaa'
            }));

            token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Identifier',
                value: 'a190'
            }));

            token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Number',
                value: 213.23
            }));

           
            token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '/'
            }));

            token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '*'
            }));

           token = scanner.next();
            expect(token).toEqual(jasmine.objectContaining({
                type: 'Operator',
                value: '-'
            }));
        });

    });

});