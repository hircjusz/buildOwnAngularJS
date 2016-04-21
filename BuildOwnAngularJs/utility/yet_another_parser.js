/// <reference path="../lib/loodash.js" />

function isWhiteSpace(ch) {
    return (ch === 'u0009')
        || (ch === ' ')
        || (ch === 'u00A0');
}

function isLetter(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

function isDecimalDigit(ch) 
{ return (ch >= '0') && (ch <= '9'); }

