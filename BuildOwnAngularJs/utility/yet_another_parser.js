/// <reference path="../lib/loodash.js" />


function Scanner(expression) {
    this.expression = expression;
    this.index = 0;
    this.length = expression ? expression.length : 0;
}

Scanner.prototype.isWhiteSpace= function(ch) {
    return (ch === 'u0009')
        || (ch === ' ')
        || (ch === 'u00A0');
}

//function isWhiteSpace(ch) {
//    return (ch === 'u0009')
//        || (ch === ' ')
//        || (ch === 'u00A0');
//}

Scanner.prototype.isLetter=function(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

Scanner.prototype.isDecimalDigit=function(ch)
{ return (ch >= '0') && (ch <= '9'); }


Scanner.prototype.createToken=function(type, value) {
    return {
        type: type,
        value: value
    }
}

Scanner.prototype.getNextChar= function() {
    var ch = undefined,
        idx = this.index;
    if (idx < this.length) {
        ch = this.expression.charAt(idx);
        this.index += 1;
    }
    return ch;
}

Scanner.prototype.peekNextChar= function() {
    var idx = this.index;
    return ((idx < this.length) ? this.expression.charAt(idx) : undefined);

}


Scanner.prototype.skipSpaces= function() {
    var ch;
    while (this.index < this.length) {
        ch = this.peekNextChar();
        if (!this.isWhiteSpace(ch)) {
            break;
        }
        this.getNextChar();
    }
}

Scanner.prototype.scanOperator= function() {
    var ch = this.peekNextChar();
    if ('+-*/()'.indexOf(ch) >= 0) {
        return this.createToken('Operator',this.getNextChar());
    }
    return undefined;
}

Scanner.prototype.isIdentifierStart=function (ch) {
    return (ch === '_') || this.isLetter(ch);
}

Scanner.prototype.isIdentifierPart= function(ch) {
    return this.isIdentifierStart(ch) || this.isDecimalDigit(ch);
}

Scanner.prototype.scanIdentifier= function() {
    var ch, id;
    ch = this.peekNextChar();

    if (!this.isIdentifierStart(ch)) {
        return undefined;
    }
    id = this.getNextChar();
    while (true) {
        ch = this.peekNextChar();
        if (!this.isIdentifierPart(ch)) {
            break;
        }
        id+= this.getNextChar();

    }
    return this.createToken('Identifier',id);
}

Scanner.prototype.scanNumber= function() {
    var ch = this.peekNextChar();

    if (!this.isDecimalDigit(ch) && (ch !== '.')) {
        return undefined;
    }
    var isInt = false;

    var number = '';
    if (ch !== '.') {
        isInt = true;
        number = this.getNextChar();
        while (true) {
            ch = this.peekNextChar();
            if (!this.isDecimalDigit(ch)) {
                break;
            }
            number += this.getNextChar();
        }
    }

    if (ch === '.') {
        isInt = false;
        number += ch;
        ch = this.getNextChar();
        while (true) {
            ch = this.peekNextChar();
            if (!this.isDecimalDigit(ch)) {
                break;
            }
            number += this.getNextChar();
        }
    }

    if (ch === 'e' || ch === 'E') {
        isInt = false;
        number += this.getNextChar();
        ch = this.peekNextChar();
        if (ch === '+' || ch === '-' || this.isDecimalDigit(ch)) {
            number += this.getNextChar();
            while (true) {
                ch = this.peekNextChar();
                if (!this.isDecimalDigit(ch)) {
                    break;
                }
                number += this.getNextChar();
            }
        } else {
            throw new SyntaxError('Unexpected character after exponent sign');
        }

    }
      return this.createToken('Number',isInt?parseInt(number):parseFloat(number));

}

Scanner.prototype.next= function() {
    var token;

    this.skipSpaces();
    if (this.index >= this.length) {
        return undefined;
    }

    token = this.scanNumber();
    if (typeof token !== 'undefined') {
        return token;
    }

    token = this.scanOperator();
    if (typeof token !== 'undefined') {
        return token;
    }

    token = this.scanIdentifier();
    if (typeof token !== 'undefined') {
        return token;
    }
    throw new SyntaxError('Unknown token '+this.peekNextChar());

}


function Lexer() {
}

Lexer.prototype.reset= function(expression) {
    this.scanner = new Scanner(expression);
}

Lexer.prototype.next = function () {
    this.currenToken = this.scanner.next();
    return this.currenToken;
}

Lexer.prototype.peek = function () {
    if (!this.currenToken) this.next();
    return this.currenToken;
}


function T() {
    
}

T.Identifier = 'Identifier';
T.Number = 'Number';


function Parser() {
    
}

Parser.prototype.parse= function(expression) {
    this.lexer = new Lexer();
    this.lexer.reset(expression);

    var expr=this.parseExpression();

    return {
        'Expression':expr
    };

}

Parser.prototype.matchOp = function (token,op) {
    return (typeof token !== 'undefined') &&
        token.type === 'Operator' &&
        token.value === op;
};



Parser.prototype.parseExpression = function() {
    return this.parseAssignment();

};

Parser.prototype.parseAssignment = function () {
    var token, expr;
    expr = this.parseAdditive();
    return expr;
};

Parser.prototype.parseAdditive = function () {
    var token, expr;
    expr = this.parseMultiplicative();
    return expr;

};

Parser.prototype.parseMultiplicative = function () {
    var token, expr;
    expr = this.parseUnary();
    return expr;

};

Parser.prototype.parseUnary = function () {
    var token, expr;
    expr = this.parsePrimary();
    return expr;
};

Parser.prototype.parsePrimary = function () {
    var token, expr;
    token = this.lexer.peek();

    if (token.type === T.Number) {
        token = this.lexer.peek();
        return {
            'Number':token.value
        };
    }

    return expr;
};

Parser.prototype.parseFunctionCall = function () {
    var token, expr;
};

Parser.prototype.parseArgumentList = function () {
    var token, expr;
};
