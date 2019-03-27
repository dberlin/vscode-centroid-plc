// Generated from src/CentroidPLC.g4 by ANTLR 4.7.3-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { CentroidPLCListener } from "./CentroidPLCListener";
import { CentroidPLCVisitor } from "./CentroidPLCVisitor";


export class CentroidPLCParser extends Parser {
	public static readonly StringLiteral = 1;
	public static readonly IntegerConstant = 2;
	public static readonly FloatingConstant = 3;
	public static readonly Whitespace = 4;
	public static readonly Comment = 5;
	public static readonly LParen = 6;
	public static readonly RParen = 7;
	public static readonly LBracket = 8;
	public static readonly RBracket = 9;
	public static readonly Comma = 10;
	public static readonly AndAnd = 11;
	public static readonly OrOr = 12;
	public static readonly Or = 13;
	public static readonly Xor = 14;
	public static readonly And = 15;
	public static readonly LessThanEqual = 16;
	public static readonly GreaterThanEqual = 17;
	public static readonly LessThan = 18;
	public static readonly GreatherThan = 19;
	public static readonly NotEqual = 20;
	public static readonly DoubleEqual = 21;
	public static readonly Plus = 22;
	public static readonly Minus = 23;
	public static readonly Star = 24;
	public static readonly Div = 25;
	public static readonly Mod = 26;
	public static readonly Not = 27;
	public static readonly Assignment = 28;
	public static readonly MathCall = 29;
	public static readonly BITRST = 30;
	public static readonly BITST = 31;
	public static readonly BITSET = 32;
	public static readonly BTW = 33;
	public static readonly RawAccess = 34;
	public static readonly IF = 35;
	public static readonly IS = 36;
	public static readonly JMP = 37;
	public static readonly MSG = 38;
	public static readonly RST = 39;
	public static readonly SET = 40;
	public static readonly THEN = 41;
	public static readonly WTB = 42;
	public static readonly LSHIFT = 43;
	public static readonly RSHIFT = 44;
	public static readonly Identifier = 45;
	public static readonly RULE_plcProgram = 0;
	public static readonly RULE_stage = 1;
	public static readonly RULE_declaration = 2;
	public static readonly RULE_ifStatement = 3;
	public static readonly RULE_expressionSequence = 4;
	public static readonly RULE_singleExpression = 5;
	public static readonly RULE_actionExpression = 6;
	public static readonly RULE_assignmentExpression = 7;
	public static readonly RULE_callExpression = 8;
	public static readonly RULE_messageExpression = 9;
	public static readonly RULE_setResetExpression = 10;
	public static readonly RULE_shiftExpression = 11;
	public static readonly RULE_bitOpExpression = 12;
	public static readonly RULE_bitTestExpression = 13;
	public static readonly RULE_btwwtbExpression = 14;
	public static readonly RULE_jumpExpression = 15;
	public static readonly RULE_coilExpression = 16;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"plcProgram", "stage", "declaration", "ifStatement", "expressionSequence", 
		"singleExpression", "actionExpression", "assignmentExpression", "callExpression", 
		"messageExpression", "setResetExpression", "shiftExpression", "bitOpExpression", 
		"bitTestExpression", "btwwtbExpression", "jumpExpression", "coilExpression",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, "'('", 
		"')'", "'['", "']'", "','", "'&&'", "'||'", "'|'", undefined, "'&'", "'<='", 
		"'>='", "'<'", "'>'", "'!='", "'=='", "'+'", "'-'", "'*'", "'/'", "'%'", 
		"'!'", "'='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "StringLiteral", "IntegerConstant", "FloatingConstant", "Whitespace", 
		"Comment", "LParen", "RParen", "LBracket", "RBracket", "Comma", "AndAnd", 
		"OrOr", "Or", "Xor", "And", "LessThanEqual", "GreaterThanEqual", "LessThan", 
		"GreatherThan", "NotEqual", "DoubleEqual", "Plus", "Minus", "Star", "Div", 
		"Mod", "Not", "Assignment", "MathCall", "BITRST", "BITST", "BITSET", "BTW", 
		"RawAccess", "IF", "IS", "JMP", "MSG", "RST", "SET", "THEN", "WTB", "LSHIFT", 
		"RSHIFT", "Identifier",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(CentroidPLCParser._LITERAL_NAMES, CentroidPLCParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return CentroidPLCParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "CentroidPLC.g4"; }

	// @Override
	public get ruleNames(): string[] { return CentroidPLCParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return CentroidPLCParser._serializedATN; }

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(CentroidPLCParser._ATN, this);
	}
	// @RuleVersion(0)
	public plcProgram(): PlcProgramContext {
		let _localctx: PlcProgramContext = new PlcProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, CentroidPLCParser.RULE_plcProgram);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 35;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 34;
				this.stage();
				}
				}
				this.state = 37;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === CentroidPLCParser.IF || _la === CentroidPLCParser.Identifier);
			this.state = 39;
			this.match(CentroidPLCParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public stage(): StageContext {
		let _localctx: StageContext = new StageContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, CentroidPLCParser.RULE_stage);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 42;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				{
				this.state = 41;
				this.match(CentroidPLCParser.Identifier);
				}
				break;
			}
			this.state = 46;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 46;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case CentroidPLCParser.Identifier:
						{
						this.state = 44;
						this.declaration();
						}
						break;
					case CentroidPLCParser.IF:
						{
						this.state = 45;
						this.ifStatement();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 48;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, CentroidPLCParser.RULE_declaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 50;
			this.match(CentroidPLCParser.Identifier);
			this.state = 51;
			this.match(CentroidPLCParser.IS);
			this.state = 52;
			this.singleExpression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ifStatement(): IfStatementContext {
		let _localctx: IfStatementContext = new IfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, CentroidPLCParser.RULE_ifStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 54;
			this.match(CentroidPLCParser.IF);
			this.state = 55;
			this.singleExpression(0);
			this.state = 56;
			this.match(CentroidPLCParser.THEN);
			this.state = 57;
			this.actionExpression();
			this.state = 62;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CentroidPLCParser.Comma) {
				{
				{
				this.state = 58;
				this.match(CentroidPLCParser.Comma);
				this.state = 59;
				this.actionExpression();
				}
				}
				this.state = 64;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expressionSequence(): ExpressionSequenceContext {
		let _localctx: ExpressionSequenceContext = new ExpressionSequenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, CentroidPLCParser.RULE_expressionSequence);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 65;
			this.singleExpression(0);
			this.state = 70;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === CentroidPLCParser.Comma) {
				{
				{
				this.state = 66;
				this.match(CentroidPLCParser.Comma);
				this.state = 67;
				this.singleExpression(0);
				}
				}
				this.state = 72;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public singleExpression(): SingleExpressionContext;
	public singleExpression(_p: number): SingleExpressionContext;
	// @RuleVersion(0)
	public singleExpression(_p?: number): SingleExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: SingleExpressionContext = new SingleExpressionContext(this._ctx, _parentState);
		let _prevctx: SingleExpressionContext = _localctx;
		let _startState: number = 10;
		this.enterRecursionRule(_localctx, 10, CentroidPLCParser.RULE_singleExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 97;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CentroidPLCParser.Plus:
				{
				_localctx = new UnaryPlusExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;

				this.state = 74;
				this.match(CentroidPLCParser.Plus);
				this.state = 75;
				this.singleExpression(18);
				}
				break;
			case CentroidPLCParser.Minus:
				{
				_localctx = new UnaryMinusExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 76;
				this.match(CentroidPLCParser.Minus);
				this.state = 77;
				this.singleExpression(17);
				}
				break;
			case CentroidPLCParser.Not:
				{
				_localctx = new NotExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 78;
				this.match(CentroidPLCParser.Not);
				this.state = 79;
				this.singleExpression(16);
				}
				break;
			case CentroidPLCParser.MathCall:
				{
				_localctx = new MathCallExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 80;
				this.match(CentroidPLCParser.MathCall);
				this.state = 81;
				this.match(CentroidPLCParser.LParen);
				this.state = 82;
				this.expressionSequence();
				this.state = 83;
				this.match(CentroidPLCParser.RParen);
				}
				break;
			case CentroidPLCParser.RawAccess:
				{
				_localctx = new RawMemAccessExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 85;
				this.match(CentroidPLCParser.RawAccess);
				this.state = 86;
				this.match(CentroidPLCParser.LBracket);
				this.state = 87;
				this.singleExpression(0);
				this.state = 88;
				this.match(CentroidPLCParser.RBracket);
				}
				break;
			case CentroidPLCParser.LParen:
				{
				_localctx = new ParenExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 90;
				this.match(CentroidPLCParser.LParen);
				this.state = 91;
				this.singleExpression(0);
				this.state = 92;
				this.match(CentroidPLCParser.RParen);
				}
				break;
			case CentroidPLCParser.Identifier:
				{
				_localctx = new IdentifierExperssionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 94;
				this.match(CentroidPLCParser.Identifier);
				}
				break;
			case CentroidPLCParser.IntegerConstant:
				{
				_localctx = new IntConstantExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 95;
				this.match(CentroidPLCParser.IntegerConstant);
				}
				break;
			case CentroidPLCParser.FloatingConstant:
				{
				_localctx = new FloatConstantExpressionContext(_localctx);
				this._ctx = _localctx;
				_prevctx = _localctx;
				this.state = 96;
				this.match(CentroidPLCParser.FloatingConstant);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 128;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 126;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 99;
						if (!(this.precpred(this._ctx, 15))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 15)");
						}
						this.state = 100;
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CentroidPLCParser.Star) | (1 << CentroidPLCParser.Div) | (1 << CentroidPLCParser.Mod))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 101;
						this.singleExpression(16);
						}
						break;

					case 2:
						{
						_localctx = new AdditiveExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 102;
						if (!(this.precpred(this._ctx, 14))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 14)");
						}
						this.state = 103;
						_la = this._input.LA(1);
						if (!(_la === CentroidPLCParser.Plus || _la === CentroidPLCParser.Minus)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 104;
						this.singleExpression(15);
						}
						break;

					case 3:
						{
						_localctx = new RelationalExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 105;
						if (!(this.precpred(this._ctx, 13))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 13)");
						}
						this.state = 106;
						_la = this._input.LA(1);
						if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << CentroidPLCParser.LessThanEqual) | (1 << CentroidPLCParser.GreaterThanEqual) | (1 << CentroidPLCParser.LessThan) | (1 << CentroidPLCParser.GreatherThan))) !== 0))) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 107;
						this.singleExpression(14);
						}
						break;

					case 4:
						{
						_localctx = new EqualityExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 108;
						if (!(this.precpred(this._ctx, 12))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 12)");
						}
						this.state = 109;
						_la = this._input.LA(1);
						if (!(_la === CentroidPLCParser.NotEqual || _la === CentroidPLCParser.DoubleEqual)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 110;
						this.singleExpression(13);
						}
						break;

					case 5:
						{
						_localctx = new BitAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 111;
						if (!(this.precpred(this._ctx, 11))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 11)");
						}
						this.state = 112;
						this.match(CentroidPLCParser.And);
						this.state = 113;
						this.singleExpression(12);
						}
						break;

					case 6:
						{
						_localctx = new BitXOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 114;
						if (!(this.precpred(this._ctx, 10))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 10)");
						}
						this.state = 115;
						this.match(CentroidPLCParser.Xor);
						this.state = 116;
						this.singleExpression(11);
						}
						break;

					case 7:
						{
						_localctx = new BitOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 117;
						if (!(this.precpred(this._ctx, 9))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 9)");
						}
						this.state = 118;
						this.match(CentroidPLCParser.Or);
						this.state = 119;
						this.singleExpression(10);
						}
						break;

					case 8:
						{
						_localctx = new LogicalAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 120;
						if (!(this.precpred(this._ctx, 8))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 8)");
						}
						this.state = 121;
						this.match(CentroidPLCParser.AndAnd);
						this.state = 122;
						this.singleExpression(9);
						}
						break;

					case 9:
						{
						_localctx = new LogicalOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						this.pushNewRecursionContext(_localctx, _startState, CentroidPLCParser.RULE_singleExpression);
						this.state = 123;
						if (!(this.precpred(this._ctx, 7))) {
							throw new FailedPredicateException(this, "this.precpred(this._ctx, 7)");
						}
						this.state = 124;
						this.match(CentroidPLCParser.OrOr);
						this.state = 125;
						this.singleExpression(8);
						}
						break;
					}
					}
				}
				this.state = 130;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public actionExpression(): ActionExpressionContext {
		let _localctx: ActionExpressionContext = new ActionExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, CentroidPLCParser.RULE_actionExpression);
		try {
			this.state = 134;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CentroidPLCParser.LParen:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 131;
				this.coilExpression();
				}
				break;
			case CentroidPLCParser.Identifier:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 132;
				this.assignmentExpression();
				}
				break;
			case CentroidPLCParser.BITRST:
			case CentroidPLCParser.BITST:
			case CentroidPLCParser.BITSET:
			case CentroidPLCParser.BTW:
			case CentroidPLCParser.JMP:
			case CentroidPLCParser.MSG:
			case CentroidPLCParser.RST:
			case CentroidPLCParser.SET:
			case CentroidPLCParser.WTB:
			case CentroidPLCParser.LSHIFT:
			case CentroidPLCParser.RSHIFT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 133;
				this.callExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public assignmentExpression(): AssignmentExpressionContext {
		let _localctx: AssignmentExpressionContext = new AssignmentExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, CentroidPLCParser.RULE_assignmentExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 136;
			this.match(CentroidPLCParser.Identifier);
			this.state = 137;
			this.match(CentroidPLCParser.Assignment);
			this.state = 140;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CentroidPLCParser.IntegerConstant:
			case CentroidPLCParser.FloatingConstant:
			case CentroidPLCParser.LParen:
			case CentroidPLCParser.Plus:
			case CentroidPLCParser.Minus:
			case CentroidPLCParser.Not:
			case CentroidPLCParser.MathCall:
			case CentroidPLCParser.RawAccess:
			case CentroidPLCParser.Identifier:
				{
				this.state = 138;
				this.singleExpression(0);
				}
				break;
			case CentroidPLCParser.StringLiteral:
				{
				this.state = 139;
				this.match(CentroidPLCParser.StringLiteral);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public callExpression(): CallExpressionContext {
		let _localctx: CallExpressionContext = new CallExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, CentroidPLCParser.RULE_callExpression);
		try {
			this.state = 149;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case CentroidPLCParser.MSG:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 142;
				this.messageExpression();
				}
				break;
			case CentroidPLCParser.BITRST:
			case CentroidPLCParser.BITSET:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 143;
				this.bitOpExpression();
				}
				break;
			case CentroidPLCParser.BITST:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 144;
				this.bitTestExpression();
				}
				break;
			case CentroidPLCParser.BTW:
			case CentroidPLCParser.WTB:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 145;
				this.btwwtbExpression();
				}
				break;
			case CentroidPLCParser.LSHIFT:
			case CentroidPLCParser.RSHIFT:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 146;
				this.shiftExpression();
				}
				break;
			case CentroidPLCParser.RST:
			case CentroidPLCParser.SET:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 147;
				this.setResetExpression();
				}
				break;
			case CentroidPLCParser.JMP:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 148;
				this.jumpExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public messageExpression(): MessageExpressionContext {
		let _localctx: MessageExpressionContext = new MessageExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, CentroidPLCParser.RULE_messageExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 151;
			this.match(CentroidPLCParser.MSG);
			this.state = 152;
			this.singleExpression(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public setResetExpression(): SetResetExpressionContext {
		let _localctx: SetResetExpressionContext = new SetResetExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, CentroidPLCParser.RULE_setResetExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 154;
			_la = this._input.LA(1);
			if (!(_la === CentroidPLCParser.RST || _la === CentroidPLCParser.SET)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 155;
			this.match(CentroidPLCParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public shiftExpression(): ShiftExpressionContext {
		let _localctx: ShiftExpressionContext = new ShiftExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, CentroidPLCParser.RULE_shiftExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 157;
			_la = this._input.LA(1);
			if (!(_la === CentroidPLCParser.LSHIFT || _la === CentroidPLCParser.RSHIFT)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 158;
			this.match(CentroidPLCParser.Identifier);
			this.state = 159;
			this.match(CentroidPLCParser.IntegerConstant);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bitOpExpression(): BitOpExpressionContext {
		let _localctx: BitOpExpressionContext = new BitOpExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, CentroidPLCParser.RULE_bitOpExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 161;
			_la = this._input.LA(1);
			if (!(_la === CentroidPLCParser.BITRST || _la === CentroidPLCParser.BITSET)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 162;
			this.match(CentroidPLCParser.Identifier);
			this.state = 163;
			this.match(CentroidPLCParser.IntegerConstant);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bitTestExpression(): BitTestExpressionContext {
		let _localctx: BitTestExpressionContext = new BitTestExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, CentroidPLCParser.RULE_bitTestExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 165;
			this.match(CentroidPLCParser.BITST);
			this.state = 166;
			this.match(CentroidPLCParser.Identifier);
			this.state = 167;
			this.match(CentroidPLCParser.IntegerConstant);
			this.state = 169;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				{
				this.state = 168;
				this.match(CentroidPLCParser.Identifier);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public btwwtbExpression(): BtwwtbExpressionContext {
		let _localctx: BtwwtbExpressionContext = new BtwwtbExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, CentroidPLCParser.RULE_btwwtbExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 171;
			_la = this._input.LA(1);
			if (!(_la === CentroidPLCParser.BTW || _la === CentroidPLCParser.WTB)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 172;
			this.match(CentroidPLCParser.Identifier);
			this.state = 173;
			this.match(CentroidPLCParser.Identifier);
			this.state = 175;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === CentroidPLCParser.IntegerConstant) {
				{
				this.state = 174;
				this.match(CentroidPLCParser.IntegerConstant);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public jumpExpression(): JumpExpressionContext {
		let _localctx: JumpExpressionContext = new JumpExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, CentroidPLCParser.RULE_jumpExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 177;
			this.match(CentroidPLCParser.JMP);
			this.state = 178;
			this.match(CentroidPLCParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public coilExpression(): CoilExpressionContext {
		let _localctx: CoilExpressionContext = new CoilExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, CentroidPLCParser.RULE_coilExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 180;
			this.match(CentroidPLCParser.LParen);
			this.state = 181;
			this.match(CentroidPLCParser.Identifier);
			this.state = 182;
			this.match(CentroidPLCParser.RParen);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 5:
			return this.singleExpression_sempred(_localctx as SingleExpressionContext, predIndex);
		}
		return true;
	}
	private singleExpression_sempred(_localctx: SingleExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 15);

		case 1:
			return this.precpred(this._ctx, 14);

		case 2:
			return this.precpred(this._ctx, 13);

		case 3:
			return this.precpred(this._ctx, 12);

		case 4:
			return this.precpred(this._ctx, 11);

		case 5:
			return this.precpred(this._ctx, 10);

		case 6:
			return this.precpred(this._ctx, 9);

		case 7:
			return this.precpred(this._ctx, 8);

		case 8:
			return this.precpred(this._ctx, 7);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03/\xBB\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x03" +
		"\x02\x06\x02&\n\x02\r\x02\x0E\x02\'\x03\x02\x03\x02\x03\x03\x05\x03-\n" +
		"\x03\x03\x03\x03\x03\x06\x031\n\x03\r\x03\x0E\x032\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x07\x05?" +
		"\n\x05\f\x05\x0E\x05B\v\x05\x03\x06\x03\x06\x03\x06\x07\x06G\n\x06\f\x06" +
		"\x0E\x06J\v\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07" +
		"d\n\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x07\x07\x81\n\x07\f\x07\x0E\x07\x84\v\x07\x03\b\x03\b\x03\b\x05" +
		"\b\x89\n\b\x03\t\x03\t\x03\t\x03\t\x05\t\x8F\n\t\x03\n\x03\n\x03\n\x03" +
		"\n\x03\n\x03\n\x03\n\x05\n\x98\n\n\x03\v\x03\v\x03\v\x03\f\x03\f\x03\f" +
		"\x03\r\x03\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F" +
		"\x03\x0F\x03\x0F\x05\x0F\xAC\n\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x05" +
		"\x10\xB2\n\x10\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12" +
		"\x03\x12\x02\x02\x03\f\x13\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E" +
		"\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 " +
		"\x02\"\x02\x02\n\x03\x02\x1A\x1C\x03\x02\x18\x19\x03\x02\x12\x15\x03\x02" +
		"\x16\x17\x03\x02)*\x03\x02-.\x04\x02  \"\"\x04\x02##,,\x02\xCB\x02%\x03" +
		"\x02\x02\x02\x04,\x03\x02\x02\x02\x064\x03\x02\x02\x02\b8\x03\x02\x02" +
		"\x02\nC\x03\x02\x02\x02\fc\x03\x02\x02\x02\x0E\x88\x03\x02\x02\x02\x10" +
		"\x8A\x03\x02\x02\x02\x12\x97\x03\x02\x02\x02\x14\x99\x03\x02\x02\x02\x16" +
		"\x9C\x03\x02\x02\x02\x18\x9F\x03\x02\x02\x02\x1A\xA3\x03\x02\x02\x02\x1C" +
		"\xA7\x03\x02\x02\x02\x1E\xAD\x03\x02\x02\x02 \xB3\x03\x02\x02\x02\"\xB6" +
		"\x03\x02\x02\x02$&\x05\x04\x03\x02%$\x03\x02\x02\x02&\'\x03\x02\x02\x02" +
		"\'%\x03\x02\x02\x02\'(\x03\x02\x02\x02()\x03\x02\x02\x02)*\x07\x02\x02" +
		"\x03*\x03\x03\x02\x02\x02+-\x07/\x02\x02,+\x03\x02\x02\x02,-\x03\x02\x02" +
		"\x02-0\x03\x02\x02\x02.1\x05\x06\x04\x02/1\x05\b\x05\x020.\x03\x02\x02" +
		"\x020/\x03\x02\x02\x0212\x03\x02\x02\x0220\x03\x02\x02\x0223\x03\x02\x02" +
		"\x023\x05\x03\x02\x02\x0245\x07/\x02\x0256\x07&\x02\x0267\x05\f\x07\x02" +
		"7\x07\x03\x02\x02\x0289\x07%\x02\x029:\x05\f\x07\x02:;\x07+\x02\x02;@" +
		"\x05\x0E\b\x02<=\x07\f\x02\x02=?\x05\x0E\b\x02><\x03\x02\x02\x02?B\x03" +
		"\x02\x02\x02@>\x03\x02\x02\x02@A\x03\x02\x02\x02A\t\x03\x02\x02\x02B@" +
		"\x03\x02\x02\x02CH\x05\f\x07\x02DE\x07\f\x02\x02EG\x05\f\x07\x02FD\x03" +
		"\x02\x02\x02GJ\x03\x02\x02\x02HF\x03\x02\x02\x02HI\x03\x02\x02\x02I\v" +
		"\x03\x02\x02\x02JH\x03\x02\x02\x02KL\b\x07\x01\x02LM\x07\x18\x02\x02M" +
		"d\x05\f\x07\x14NO\x07\x19\x02\x02Od\x05\f\x07\x13PQ\x07\x1D\x02\x02Qd" +
		"\x05\f\x07\x12RS\x07\x1F\x02\x02ST\x07\b\x02\x02TU\x05\n\x06\x02UV\x07" +
		"\t\x02\x02Vd\x03\x02\x02\x02WX\x07$\x02\x02XY\x07\n\x02\x02YZ\x05\f\x07" +
		"\x02Z[\x07\v\x02\x02[d\x03\x02\x02\x02\\]\x07\b\x02\x02]^\x05\f\x07\x02" +
		"^_\x07\t\x02\x02_d\x03\x02\x02\x02`d\x07/\x02\x02ad\x07\x04\x02\x02bd" +
		"\x07\x05\x02\x02cK\x03\x02\x02\x02cN\x03\x02\x02\x02cP\x03\x02\x02\x02" +
		"cR\x03\x02\x02\x02cW\x03\x02\x02\x02c\\\x03\x02\x02\x02c`\x03\x02\x02" +
		"\x02ca\x03\x02\x02\x02cb\x03\x02\x02\x02d\x82\x03\x02\x02\x02ef\f\x11" +
		"\x02\x02fg\t\x02\x02\x02g\x81\x05\f\x07\x12hi\f\x10\x02\x02ij\t\x03\x02" +
		"\x02j\x81\x05\f\x07\x11kl\f\x0F\x02\x02lm\t\x04\x02\x02m\x81\x05\f\x07" +
		"\x10no\f\x0E\x02\x02op\t\x05\x02\x02p\x81\x05\f\x07\x0Fqr\f\r\x02\x02" +
		"rs\x07\x11\x02\x02s\x81\x05\f\x07\x0Etu\f\f\x02\x02uv\x07\x10\x02\x02" +
		"v\x81\x05\f\x07\rwx\f\v\x02\x02xy\x07\x0F\x02\x02y\x81\x05\f\x07\fz{\f" +
		"\n\x02\x02{|\x07\r\x02\x02|\x81\x05\f\x07\v}~\f\t\x02\x02~\x7F\x07\x0E" +
		"\x02\x02\x7F\x81\x05\f\x07\n\x80e\x03\x02\x02\x02\x80h\x03\x02\x02\x02" +
		"\x80k\x03\x02\x02\x02\x80n\x03\x02\x02\x02\x80q\x03\x02\x02\x02\x80t\x03" +
		"\x02\x02\x02\x80w\x03\x02\x02\x02\x80z\x03\x02\x02\x02\x80}\x03\x02\x02" +
		"\x02\x81\x84\x03\x02\x02\x02\x82\x80\x03\x02\x02\x02\x82\x83\x03\x02\x02" +
		"\x02\x83\r\x03\x02\x02\x02\x84\x82\x03\x02\x02\x02\x85\x89\x05\"\x12\x02" +
		"\x86\x89\x05\x10\t\x02\x87\x89\x05\x12\n\x02\x88\x85\x03\x02\x02\x02\x88" +
		"\x86\x03\x02\x02\x02\x88\x87\x03\x02\x02\x02\x89\x0F\x03\x02\x02\x02\x8A" +
		"\x8B\x07/\x02\x02\x8B\x8E\x07\x1E\x02\x02\x8C\x8F\x05\f\x07\x02\x8D\x8F" +
		"\x07\x03\x02\x02\x8E\x8C\x03\x02\x02\x02\x8E\x8D\x03\x02\x02\x02\x8F\x11" +
		"\x03\x02\x02\x02\x90\x98\x05\x14\v\x02\x91\x98\x05\x1A\x0E\x02\x92\x98" +
		"\x05\x1C\x0F\x02\x93\x98\x05\x1E\x10\x02\x94\x98\x05\x18\r\x02\x95\x98" +
		"\x05\x16\f\x02\x96\x98\x05 \x11\x02\x97\x90\x03\x02\x02\x02\x97\x91\x03" +
		"\x02\x02\x02\x97\x92\x03\x02\x02\x02\x97\x93\x03\x02\x02\x02\x97\x94\x03" +
		"\x02\x02\x02\x97\x95\x03\x02\x02\x02\x97\x96\x03\x02\x02\x02\x98\x13\x03" +
		"\x02\x02\x02\x99\x9A\x07(\x02\x02\x9A\x9B\x05\f\x07\x02\x9B\x15\x03\x02" +
		"\x02\x02\x9C\x9D\t\x06\x02\x02\x9D\x9E\x07/\x02\x02\x9E\x17\x03\x02\x02" +
		"\x02\x9F\xA0\t\x07\x02\x02\xA0\xA1\x07/\x02\x02\xA1\xA2\x07\x04\x02\x02" +
		"\xA2\x19\x03\x02\x02\x02\xA3\xA4\t\b\x02\x02\xA4\xA5\x07/\x02\x02\xA5" +
		"\xA6\x07\x04\x02\x02\xA6\x1B\x03\x02\x02\x02\xA7\xA8\x07!\x02\x02\xA8" +
		"\xA9\x07/\x02\x02\xA9\xAB\x07\x04\x02\x02\xAA\xAC\x07/\x02\x02\xAB\xAA" +
		"\x03\x02\x02\x02\xAB\xAC\x03\x02\x02\x02\xAC\x1D\x03\x02\x02\x02\xAD\xAE" +
		"\t\t\x02\x02\xAE\xAF\x07/\x02\x02\xAF\xB1\x07/\x02\x02\xB0\xB2\x07\x04" +
		"\x02\x02\xB1\xB0\x03\x02\x02\x02\xB1\xB2\x03\x02\x02\x02\xB2\x1F\x03\x02" +
		"\x02\x02\xB3\xB4\x07\'\x02\x02\xB4\xB5\x07/\x02\x02\xB5!\x03\x02\x02\x02" +
		"\xB6\xB7\x07\b\x02\x02\xB7\xB8\x07/\x02\x02\xB8\xB9\x07\t\x02\x02\xB9" +
		"#\x03\x02\x02\x02\x10\',02@Hc\x80\x82\x88\x8E\x97\xAB\xB1";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!CentroidPLCParser.__ATN) {
			CentroidPLCParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(CentroidPLCParser._serializedATN));
		}

		return CentroidPLCParser.__ATN;
	}

}

export class PlcProgramContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(CentroidPLCParser.EOF, 0); }
	public stage(): StageContext[];
	public stage(i: number): StageContext;
	public stage(i?: number): StageContext | StageContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StageContext);
		} else {
			return this.getRuleContext(i, StageContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_plcProgram; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterPlcProgram) {
			listener.enterPlcProgram(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitPlcProgram) {
			listener.exitPlcProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitPlcProgram) {
			return visitor.visitPlcProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StageContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.Identifier, 0); }
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	public ifStatement(): IfStatementContext[];
	public ifStatement(i: number): IfStatementContext;
	public ifStatement(i?: number): IfStatementContext | IfStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IfStatementContext);
		} else {
			return this.getRuleContext(i, IfStatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_stage; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterStage) {
			listener.enterStage(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitStage) {
			listener.exitStage(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitStage) {
			return visitor.visitStage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	public IS(): TerminalNode { return this.getToken(CentroidPLCParser.IS, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_declaration; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitDeclaration) {
			return visitor.visitDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfStatementContext extends ParserRuleContext {
	public IF(): TerminalNode { return this.getToken(CentroidPLCParser.IF, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public THEN(): TerminalNode { return this.getToken(CentroidPLCParser.THEN, 0); }
	public actionExpression(): ActionExpressionContext[];
	public actionExpression(i: number): ActionExpressionContext;
	public actionExpression(i?: number): ActionExpressionContext | ActionExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ActionExpressionContext);
		} else {
			return this.getRuleContext(i, ActionExpressionContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CentroidPLCParser.Comma);
		} else {
			return this.getToken(CentroidPLCParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_ifStatement; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterIfStatement) {
			listener.enterIfStatement(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitIfStatement) {
			listener.exitIfStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitIfStatement) {
			return visitor.visitIfStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionSequenceContext extends ParserRuleContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Comma(): TerminalNode[];
	public Comma(i: number): TerminalNode;
	public Comma(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CentroidPLCParser.Comma);
		} else {
			return this.getToken(CentroidPLCParser.Comma, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_expressionSequence; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterExpressionSequence) {
			listener.enterExpressionSequence(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitExpressionSequence) {
			listener.exitExpressionSequence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitExpressionSequence) {
			return visitor.visitExpressionSequence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SingleExpressionContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_singleExpression; }
	public copyFrom(ctx: SingleExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class UnaryPlusExpressionContext extends SingleExpressionContext {
	public Plus(): TerminalNode { return this.getToken(CentroidPLCParser.Plus, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterUnaryPlusExpression) {
			listener.enterUnaryPlusExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitUnaryPlusExpression) {
			listener.exitUnaryPlusExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitUnaryPlusExpression) {
			return visitor.visitUnaryPlusExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryMinusExpressionContext extends SingleExpressionContext {
	public Minus(): TerminalNode { return this.getToken(CentroidPLCParser.Minus, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterUnaryMinusExpression) {
			listener.enterUnaryMinusExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitUnaryMinusExpression) {
			listener.exitUnaryMinusExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitUnaryMinusExpression) {
			return visitor.visitUnaryMinusExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NotExpressionContext extends SingleExpressionContext {
	public Not(): TerminalNode { return this.getToken(CentroidPLCParser.Not, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterNotExpression) {
			listener.enterNotExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitNotExpression) {
			listener.exitNotExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitNotExpression) {
			return visitor.visitNotExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MultiplicativeExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Star(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.Star, 0); }
	public Div(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.Div, 0); }
	public Mod(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.Mod, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterMultiplicativeExpression) {
			listener.enterMultiplicativeExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitMultiplicativeExpression) {
			listener.exitMultiplicativeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AdditiveExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Plus(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.Plus, 0); }
	public Minus(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.Minus, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterAdditiveExpression) {
			listener.enterAdditiveExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitAdditiveExpression) {
			listener.exitAdditiveExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RelationalExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public LessThan(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.LessThan, 0); }
	public GreatherThan(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.GreatherThan, 0); }
	public LessThanEqual(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.LessThanEqual, 0); }
	public GreaterThanEqual(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.GreaterThanEqual, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterRelationalExpression) {
			listener.enterRelationalExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitRelationalExpression) {
			listener.exitRelationalExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitRelationalExpression) {
			return visitor.visitRelationalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EqualityExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public DoubleEqual(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.DoubleEqual, 0); }
	public NotEqual(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.NotEqual, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterEqualityExpression) {
			listener.enterEqualityExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitEqualityExpression) {
			listener.exitEqualityExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitEqualityExpression) {
			return visitor.visitEqualityExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitAndExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public And(): TerminalNode { return this.getToken(CentroidPLCParser.And, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterBitAndExpression) {
			listener.enterBitAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitBitAndExpression) {
			listener.exitBitAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitBitAndExpression) {
			return visitor.visitBitAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitXOrExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Xor(): TerminalNode { return this.getToken(CentroidPLCParser.Xor, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterBitXOrExpression) {
			listener.enterBitXOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitBitXOrExpression) {
			listener.exitBitXOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitBitXOrExpression) {
			return visitor.visitBitXOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BitOrExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public Or(): TerminalNode { return this.getToken(CentroidPLCParser.Or, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterBitOrExpression) {
			listener.enterBitOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitBitOrExpression) {
			listener.exitBitOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitBitOrExpression) {
			return visitor.visitBitOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LogicalAndExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public AndAnd(): TerminalNode { return this.getToken(CentroidPLCParser.AndAnd, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterLogicalAndExpression) {
			listener.enterLogicalAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitLogicalAndExpression) {
			listener.exitLogicalAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitLogicalAndExpression) {
			return visitor.visitLogicalAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LogicalOrExpressionContext extends SingleExpressionContext {
	public singleExpression(): SingleExpressionContext[];
	public singleExpression(i: number): SingleExpressionContext;
	public singleExpression(i?: number): SingleExpressionContext | SingleExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SingleExpressionContext);
		} else {
			return this.getRuleContext(i, SingleExpressionContext);
		}
	}
	public OrOr(): TerminalNode { return this.getToken(CentroidPLCParser.OrOr, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterLogicalOrExpression) {
			listener.enterLogicalOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitLogicalOrExpression) {
			listener.exitLogicalOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitLogicalOrExpression) {
			return visitor.visitLogicalOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MathCallExpressionContext extends SingleExpressionContext {
	public MathCall(): TerminalNode { return this.getToken(CentroidPLCParser.MathCall, 0); }
	public LParen(): TerminalNode { return this.getToken(CentroidPLCParser.LParen, 0); }
	public expressionSequence(): ExpressionSequenceContext {
		return this.getRuleContext(0, ExpressionSequenceContext);
	}
	public RParen(): TerminalNode { return this.getToken(CentroidPLCParser.RParen, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterMathCallExpression) {
			listener.enterMathCallExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitMathCallExpression) {
			listener.exitMathCallExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitMathCallExpression) {
			return visitor.visitMathCallExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RawMemAccessExpressionContext extends SingleExpressionContext {
	public RawAccess(): TerminalNode { return this.getToken(CentroidPLCParser.RawAccess, 0); }
	public LBracket(): TerminalNode { return this.getToken(CentroidPLCParser.LBracket, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public RBracket(): TerminalNode { return this.getToken(CentroidPLCParser.RBracket, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterRawMemAccessExpression) {
			listener.enterRawMemAccessExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitRawMemAccessExpression) {
			listener.exitRawMemAccessExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitRawMemAccessExpression) {
			return visitor.visitRawMemAccessExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenExpressionContext extends SingleExpressionContext {
	public LParen(): TerminalNode { return this.getToken(CentroidPLCParser.LParen, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	public RParen(): TerminalNode { return this.getToken(CentroidPLCParser.RParen, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterParenExpression) {
			listener.enterParenExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitParenExpression) {
			listener.exitParenExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitParenExpression) {
			return visitor.visitParenExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IdentifierExperssionContext extends SingleExpressionContext {
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterIdentifierExperssion) {
			listener.enterIdentifierExperssion(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitIdentifierExperssion) {
			listener.exitIdentifierExperssion(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitIdentifierExperssion) {
			return visitor.visitIdentifierExperssion(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IntConstantExpressionContext extends SingleExpressionContext {
	public IntegerConstant(): TerminalNode { return this.getToken(CentroidPLCParser.IntegerConstant, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterIntConstantExpression) {
			listener.enterIntConstantExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitIntConstantExpression) {
			listener.exitIntConstantExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitIntConstantExpression) {
			return visitor.visitIntConstantExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FloatConstantExpressionContext extends SingleExpressionContext {
	public FloatingConstant(): TerminalNode { return this.getToken(CentroidPLCParser.FloatingConstant, 0); }
	constructor(ctx: SingleExpressionContext) {
		super(ctx.parent, ctx.invokingState);
		this.copyFrom(ctx);
	}
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterFloatConstantExpression) {
			listener.enterFloatConstantExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitFloatConstantExpression) {
			listener.exitFloatConstantExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitFloatConstantExpression) {
			return visitor.visitFloatConstantExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ActionExpressionContext extends ParserRuleContext {
	public coilExpression(): CoilExpressionContext | undefined {
		return this.tryGetRuleContext(0, CoilExpressionContext);
	}
	public assignmentExpression(): AssignmentExpressionContext | undefined {
		return this.tryGetRuleContext(0, AssignmentExpressionContext);
	}
	public callExpression(): CallExpressionContext | undefined {
		return this.tryGetRuleContext(0, CallExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_actionExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterActionExpression) {
			listener.enterActionExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitActionExpression) {
			listener.exitActionExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitActionExpression) {
			return visitor.visitActionExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AssignmentExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	public Assignment(): TerminalNode { return this.getToken(CentroidPLCParser.Assignment, 0); }
	public singleExpression(): SingleExpressionContext | undefined {
		return this.tryGetRuleContext(0, SingleExpressionContext);
	}
	public StringLiteral(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.StringLiteral, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_assignmentExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterAssignmentExpression) {
			listener.enterAssignmentExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitAssignmentExpression) {
			listener.exitAssignmentExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitAssignmentExpression) {
			return visitor.visitAssignmentExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CallExpressionContext extends ParserRuleContext {
	public messageExpression(): MessageExpressionContext | undefined {
		return this.tryGetRuleContext(0, MessageExpressionContext);
	}
	public bitOpExpression(): BitOpExpressionContext | undefined {
		return this.tryGetRuleContext(0, BitOpExpressionContext);
	}
	public bitTestExpression(): BitTestExpressionContext | undefined {
		return this.tryGetRuleContext(0, BitTestExpressionContext);
	}
	public btwwtbExpression(): BtwwtbExpressionContext | undefined {
		return this.tryGetRuleContext(0, BtwwtbExpressionContext);
	}
	public shiftExpression(): ShiftExpressionContext | undefined {
		return this.tryGetRuleContext(0, ShiftExpressionContext);
	}
	public setResetExpression(): SetResetExpressionContext | undefined {
		return this.tryGetRuleContext(0, SetResetExpressionContext);
	}
	public jumpExpression(): JumpExpressionContext | undefined {
		return this.tryGetRuleContext(0, JumpExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_callExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterCallExpression) {
			listener.enterCallExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitCallExpression) {
			listener.exitCallExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitCallExpression) {
			return visitor.visitCallExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MessageExpressionContext extends ParserRuleContext {
	public MSG(): TerminalNode { return this.getToken(CentroidPLCParser.MSG, 0); }
	public singleExpression(): SingleExpressionContext {
		return this.getRuleContext(0, SingleExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_messageExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterMessageExpression) {
			listener.enterMessageExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitMessageExpression) {
			listener.exitMessageExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitMessageExpression) {
			return visitor.visitMessageExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SetResetExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	public SET(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.SET, 0); }
	public RST(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.RST, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_setResetExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterSetResetExpression) {
			listener.enterSetResetExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitSetResetExpression) {
			listener.exitSetResetExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitSetResetExpression) {
			return visitor.visitSetResetExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ShiftExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	public IntegerConstant(): TerminalNode { return this.getToken(CentroidPLCParser.IntegerConstant, 0); }
	public LSHIFT(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.LSHIFT, 0); }
	public RSHIFT(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.RSHIFT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_shiftExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterShiftExpression) {
			listener.enterShiftExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitShiftExpression) {
			listener.exitShiftExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitShiftExpression) {
			return visitor.visitShiftExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BitOpExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	public IntegerConstant(): TerminalNode { return this.getToken(CentroidPLCParser.IntegerConstant, 0); }
	public BITSET(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.BITSET, 0); }
	public BITRST(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.BITRST, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_bitOpExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterBitOpExpression) {
			listener.enterBitOpExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitBitOpExpression) {
			listener.exitBitOpExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitBitOpExpression) {
			return visitor.visitBitOpExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BitTestExpressionContext extends ParserRuleContext {
	public BITST(): TerminalNode { return this.getToken(CentroidPLCParser.BITST, 0); }
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CentroidPLCParser.Identifier);
		} else {
			return this.getToken(CentroidPLCParser.Identifier, i);
		}
	}
	public IntegerConstant(): TerminalNode { return this.getToken(CentroidPLCParser.IntegerConstant, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_bitTestExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterBitTestExpression) {
			listener.enterBitTestExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitBitTestExpression) {
			listener.exitBitTestExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitBitTestExpression) {
			return visitor.visitBitTestExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BtwwtbExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(CentroidPLCParser.Identifier);
		} else {
			return this.getToken(CentroidPLCParser.Identifier, i);
		}
	}
	public BTW(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.BTW, 0); }
	public WTB(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.WTB, 0); }
	public IntegerConstant(): TerminalNode | undefined { return this.tryGetToken(CentroidPLCParser.IntegerConstant, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_btwwtbExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterBtwwtbExpression) {
			listener.enterBtwwtbExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitBtwwtbExpression) {
			listener.exitBtwwtbExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitBtwwtbExpression) {
			return visitor.visitBtwwtbExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JumpExpressionContext extends ParserRuleContext {
	public JMP(): TerminalNode { return this.getToken(CentroidPLCParser.JMP, 0); }
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_jumpExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterJumpExpression) {
			listener.enterJumpExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitJumpExpression) {
			listener.exitJumpExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitJumpExpression) {
			return visitor.visitJumpExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CoilExpressionContext extends ParserRuleContext {
	public LParen(): TerminalNode { return this.getToken(CentroidPLCParser.LParen, 0); }
	public Identifier(): TerminalNode { return this.getToken(CentroidPLCParser.Identifier, 0); }
	public RParen(): TerminalNode { return this.getToken(CentroidPLCParser.RParen, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return CentroidPLCParser.RULE_coilExpression; }
	// @Override
	public enterRule(listener: CentroidPLCListener): void {
		if (listener.enterCoilExpression) {
			listener.enterCoilExpression(this);
		}
	}
	// @Override
	public exitRule(listener: CentroidPLCListener): void {
		if (listener.exitCoilExpression) {
			listener.exitCoilExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: CentroidPLCVisitor<Result>): Result {
		if (visitor.visitCoilExpression) {
			return visitor.visitCoilExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


