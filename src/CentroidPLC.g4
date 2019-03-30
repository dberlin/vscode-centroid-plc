/*
 * MIT License
 * 
 * Copyright (c) 2019 Daniel Berlin
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

grammar CentroidPLC;
/* Parser */

/*
 Stages are technically optional in Centroid PLC programs. However, we factor out the common prefix
 here and pretend that everything is a stage, and that some are just unnamed.
 */

plcProgram: stage+ EOF;

// Stages are made up of either declarations or conditional statements.
stage: Identifier? (declaration | ifStatement)+;

// Declarations are x IS y form, where Y can be a math expression or a type. */
declaration: Identifier IS singleExpression;

// If statements may have multiple actions after the conditional separated by commas.
ifStatement:
	IF singleExpression THEN actionExpression (
		',' actionExpression
	)*;

// Calls use comma separated arguments
callArguments: singleExpression (',' singleExpression)*;

// This is the set of all possible things allowed in math expressions
singleExpression:
	'+' singleExpression											# UnaryPlusExpression
	| '-' singleExpression											# UnaryMinusExpression
	| '!' singleExpression											# NotExpression
	| singleExpression ('*' | '/' | '%') singleExpression			# MultiplicativeExpression
	| singleExpression ('+' | '-') singleExpression					# AdditiveExpression
	| singleExpression ('<' | '>' | '<=' | '>=') singleExpression	# RelationalExpression
	| singleExpression ('==' | '!=') singleExpression				# EqualityExpression
	| singleExpression '&' singleExpression							# BitAndExpression
	| singleExpression Xor singleExpression							# BitXOrExpression
	| singleExpression '|' singleExpression							# BitOrExpression
	| singleExpression '&&' singleExpression						# LogicalAndExpression
	| singleExpression '||' singleExpression						# LogicalOrExpression
	| MathCall '(' callArguments ')'								# MathCallExpression
	| RawAccess '[' singleExpression ']'							# RawMemAccessExpression
	| '(' singleExpression ')'										# ParenExpression
	| Identifier													# IdentifierExperssion
	| IntegerConstant												# IntConstantExpression
	| FloatingConstant												# FloatConstantExpression;

// This is the set of things that are allowed after a THEN
actionExpression:
	coilExpression
	| assignmentExpression
	| callExpression;

// Assignments of variables
assignmentExpression:
	Identifier '=' (singleExpression | StringLiteral);

// This is the set of builtin funtions that can be called.
callExpression:
	messageExpression
	| bitOpExpression
	| bitTestExpression
	| btwwtbExpression
	| shiftExpression
	| setResetExpression
	| jumpExpression;

// Messages are constants, but it is hard for us to distinguish
messageExpression: MSG singleExpression;
setResetExpression: (SET | RST) Identifier;
shiftExpression: (LSHIFT | RSHIFT) Identifier IntegerConstant;
bitOpExpression: (BITSET | BITRST) Identifier IntegerConstant;
bitTestExpression:
	BITST Identifier IntegerConstant (Identifier)?;
btwwtbExpression: (BTW | WTB) Identifier Identifier (
		IntegerConstant
	)?;
jumpExpression: JMP Identifier;
coilExpression: '(' Identifier ')';

StringLiteral: '"' SCharSequence? '"';

IntegerConstant: DecimalConstant;
FloatingConstant: DecimalFloatingConstant;

/* Lexer */
Whitespace: [ \t\r\n\u000C]+ -> channel(HIDDEN);
Comment: ';' ~[\r\n]* -> channel(HIDDEN);

LParen: '(';
RParen: ')';
LBracket: '[';
RBracket: ']';
Comma: ',';
AndAnd: '&&';
OrOr: '||';
Or: '|';
Xor: X O R | '^';
And: '&';
LessThanEqual: '<=';
GreaterThanEqual: '>=';
LessThan: '<';
GreatherThan: '>';
NotEqual: '!=';
DoubleEqual: '==';
Plus: '+';
Minus: '-';
Star: '*';
Div: '/';
Mod: '%';
Not: '!';
Assignment: '=';
/* The formatter requires the keywords be in a continuous set of tokens. */
MathCall:
	A B S
	| A C O S
	| A S I N
	| A T A N '2'
	| A T A N
	| C O S
	| D I S T '2'
	| D I S T '3'
	| P O W
	| S I N
	| S Q R T
	| T A N;
BITRST: B I T R S T;
BITST: B I T T S T;
BITSET: B I T S E T;
BTW: B T W;
RawAccess: INP | MEM | OUT;
fragment INP: I N P;
fragment MEM: M E M;
fragment OUT: O U T;
IF: I F;
IS: I S;
JMP: J M P;
MSG: M S G;
RST: R S T;
SET: S E T;
THEN: T H E N;
WTB: W T B;
LSHIFT: L S H I F T;
RSHIFT: R S H I F T;
Identifier: NonDigit (NonDigit | Digit)*;
fragment NonDigit: [a-zA-Z_];
fragment SCharSequence: SChar+;
fragment SChar: ~["\\\r\n] | EscapeSequence;
fragment EscapeSequence: '\\' ['"?abfnrtv\\];
fragment DecimalConstant: '0' | NonzeroDigit Digit*;
fragment DecimalFloatingConstant:
	FractionalConstant ExponentPart?;
fragment ExponentPart:
	'e' Sign? DigitSequence
	| 'E' Sign? DigitSequence;
fragment Sign: '+' | '-';
fragment FractionalConstant: DigitSequence? '.' DigitSequence;

fragment DigitSequence: Digit+;
fragment NonzeroDigit: [1-9];

fragment Digit: [0-9];

fragment A: [aA]; // match either an 'a' or 'A'
fragment B: [bB];
fragment C: [cC];
fragment D: [dD];
fragment E: [eE];
fragment F: [fF];
fragment G: [gG];
fragment H: [hH];
fragment I: [iI];
fragment J: [jJ];
fragment K: [kK];
fragment L: [lL];
fragment M: [mM];
fragment N: [nN];
fragment O: [oO];
fragment P: [pP];
fragment Q: [qQ];
fragment R: [rR];
fragment S: [sS];
fragment T: [tT];
fragment U: [uU];
fragment V: [vV];
fragment W: [wW];
fragment X: [xX];
fragment Y: [yY];
fragment Z: [zZ];
