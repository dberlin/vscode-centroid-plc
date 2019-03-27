grammar CentroidPLC;
/* Parser */
plcProgram: stage+ EOF;
stage: Identifier? (declaration | ifStatement)+;
declaration: Identifier IS singleExpression;
ifStatement:
	IF singleExpression THEN actionExpression (
		',' actionExpression
	)*;

expressionSequence: singleExpression (',' singleExpression)*;

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
	| MathCall '(' expressionSequence ')'							# MathCallExpression
	| RawAccess '[' singleExpression ']'							# RawMemAccessExpression
	| '(' singleExpression ')'										# ParenExpression
	| Identifier													# IdentifierExperssion
	| IntegerConstant												# IntConstantExpression
	| FloatingConstant												# FloatConstantExpression;
actionExpression:
	coilExpression
	| assignmentExpression
	| callExpression;
assignmentExpression:
	Identifier '=' (singleExpression | StringLiteral);
callExpression:
	messageExpression
	| bitOpExpression
	| bitTestExpression
	| btwwtbExpression
	| shiftExpression
	| setResetExpression
	| jumpExpression;
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
Whitespace: [ \t\r\n\u000C]+ -> skip;
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
