/*
 * MIT License
 *
 * Copyright (c) 2019 Daniel Berlin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/*
 * MIT License
 *
 * Copyright (c) 2019 Daniel Berlin
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Parser and lexer for Centroid PLC code.
// Note that i have not been careful around math precedence since this is not
// for a compiler.
import {
  createToken,
  ITokenConfig,
  Lexer,
  Parser,
  TokenType
} from "chevrotain";

/* A ton of token types, yay! */
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED
});
// Shortcut our standard tokens
function token(
  name: string,
  pattern: RegExp | string,
  longer_alt?: TokenType | undefined,
  categories?: TokenType | TokenType[] | undefined
) {
  let config: ITokenConfig = { name: name, pattern: pattern };
  if (longer_alt) config.longer_alt = longer_alt;
  if (categories) config.categories = categories;
  return createToken(config);
}
const Comment = createToken({
  name: "Comment",
  pattern: /;.*/,
  group: "Comments"
});
const Strings = token("Strings", /"(?:\\["\\]|[^\n"\\])*"/);
const FPNumber = token("FPNumber", /(?:[0-9]+)?\.[0-9]+/);
const Number = token("Number", /[0-9]+/);
const LParen = token("LParen", "(");
const RParen = token("RParen", ")");
const LBracket = token("LBracket", "[");
const RBracket = token("RBracket", "]");
const Comma = token("Comma", ",");
// We don't care about correctness of logical vs binary math ops
const BinaryOp = token("BinaryOp", Lexer.NA);
const BinaryMathOp = token("BinaryMathOp", /\*|\+|\%|\//, undefined, BinaryOp);
const UnaryOp = token("UnaryOp", Lexer.NA);
const Minus = token("Minus", /-/, undefined, [BinaryOp, UnaryOp]);
const UnaryNot = token("UnaryNot", "!", undefined, UnaryOp);
const RelationalOp = token(
  "RelationalOp",
  /<=|>=|<|>|!=|==/,
  undefined,
  BinaryOp
);
const LogicalOp = token("LogicalOp", /&&|\|\||XOR|\^/, undefined, BinaryOp);
const Assignment = token("Assignment", "=");
const Identifier = token("Identifier", /[a-zA-Z_][a-zA-Z_\d]*/);

const mathCall = [
  "ABS",
  "ACOS",
  "ASIN",
  "ATAN2",
  "ATAN",
  "COS",
  "DIST2",
  "DIST3",
  "POW",
  "SIN",
  "SQRT",
  "TAN"
];
const MathCall = token("MathCall", Lexer.NA, undefined);
const mathCallTokens = mathCall.map(val =>
  token(val, new RegExp(val, "i"), Identifier, MathCall)
);
const RawAccess = token("RawAccess", Lexer.NA);
const MEM = token("MEM", /MEM/, Identifier, RawAccess);
const INP = token("INP", /INP/, Identifier, RawAccess);
const OUT = token("OUT", /OUT/, Identifier, RawAccess);
const BITRST = token("BITRST", /BITRST/i, Identifier);
const BITSET = token("BITSET", /BITSET/i, Identifier);
const BITTST = token("BITTST", /BITTST/i, Identifier);
const BTW = token("BTW", /BTW/i, Identifier);
const IF = token("IF", /IF/i, Identifier);
const IS = token("IS", /IS/i, Identifier);
const JMP = token("JMP", /JMP/i, Identifier);
const MSG = token("MSG", /MSG/i, Identifier);
const RST = token("RST", /RST/i, Identifier);
const SET = token("SET", /SET/i, Identifier);
const THEN = token("THEN", /THEN/i, Identifier);
const WTB = token("WTB", /WTB/i, Identifier);
const LSHIFT = token("LSHIFT", /LSHIFT/i, Identifier);
const RSHIFT = token("RSHIFT", /RSHIFT/i, Identifier);

export const Keywords = [
  BITRST,
  BITSET,
  BITTST,
  BTW,
  IF,
  IS,
  JMP,
  LSHIFT,

  MSG,

  RSHIFT,
  RST,
  SET,
  THEN,
  WTB
];
export const allTokens: TokenType[] = [
  WhiteSpace,
  Comment,
  Strings,
  LParen,
  RParen,
  LBracket,
  RBracket,
  Comma,
  RelationalOp,
  BinaryOp,
  BinaryMathOp,
  LogicalOp,
  Assignment,
  UnaryOp,
  UnaryNot,
  Minus,
  MathCall,
  RawAccess,
  INP,
  OUT,
  MEM
]
  .concat(Keywords)
  .concat(mathCallTokens)
  .concat([Identifier, FPNumber, Number]);
export function createPLCLexer() {
  return new Lexer(allTokens, { ensureOptimizations: true });
}

type ORCache = { ALT: () => any }[] | undefined;
class CentroidPLCParser extends Parser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }
  public PLCProgram = this.RULE("PLCProgram", () => {
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.Line);
    });
  });
  private c1: ORCache;
  // A single line of the program
  private Line = this.RULE("Line", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.Declaration) },
      { ALT: () => this.SUBRULE(this.IfStatement) },
      { ALT: () => this.SUBRULE(this.Stage) }
    ]);
  });
  // A stage implementation
  // <stagename>
  private Stage = this.RULE("Stage", () => {
    this.CONSUME(Identifier);
  });
  // A declaration
  // identifier IS (identifier | constant)
  // TODO: Gate the type properly
  private Declaration = this.RULE("Declaration", () => {
    this.CONSUME1(Identifier);
    this.CONSUME(IS);
    this.SUBRULE(this.MathExpression);
    /*
    this.OR([
      { ALT: () => this.CONSUME(Number) },
      { ALT: () => this.CONSUME(FPNumber) },
      { ALT: () => this.CONSUME2(Identifier) }
    ]);*/
  });
  // If TruthExpression Then ActionExpression
  private IfStatement = this.RULE("IfStatement", () => {
    this.CONSUME(IF);
    this.SUBRULE(this.TruthExpression);
    this.CONSUME(THEN);
    this.SUBRULE1(this.ActionExpression);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.ActionExpression);
    });
  });
  // expression resulting in a truth value
  private TruthExpression = this.RULE("TruthExpression", () => {
    this.SUBRULE1(this.RelationalExpression);
    this.MANY(() => {
      this.CONSUME(LogicalOp);
      this.SUBRULE2(this.RelationalExpression);
    });
  });
  // MathExpression {<RelationalOp> MathExpression}
  private RelationalExpression = this.RULE("RelationalExpression", () => {
    this.SUBRULE1(this.MathExpression);
    this.OPTION(() => {
      this.CONSUME(RelationalOp);
      this.SUBRULE2(this.MathExpression);
    });
  });
  // ((unary | atomic) {binaryop MathExpression}
  private MathExpression = this.RULE("MathExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.MathCallExpression) },
      { ALT: () => this.SUBRULE(this.UnaryExpression) },
      { ALT: () => this.SUBRULE(this.AtomicExpression) }
    ]);
    this.MANY(() => {
      this.CONSUME(BinaryOp);
      this.SUBRULE(this.MathExpression);
    });
  });
  private MathCallExpression = this.RULE("MathCallExpression", () => {
    this.CONSUME(MathCall);
    this.CONSUME(LParen);
    this.SUBRULE1(this.MathExpression);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.MathExpression);
    });
    this.CONSUME(RParen);
  });
  // Paren surrounded math
  // ( MathExpression )
  private ParenExpression = this.RULE("ParenExpression", () => {
    this.CONSUME(LParen);
    this.SUBRULE(this.MathExpression);
    this.CONSUME(RParen);
  });
  // Unary math
  // ! MathExpression
  private UnaryExpression = this.RULE("UnaryExpression", () => {
    this.CONSUME(UnaryOp);
    this.SUBRULE(this.MathExpression);
  });
  // Atomic expression piece
  // (parenexpression | raw memory access | identifier | number | fpnumber)
  private AtomicExpression = this.RULE("AtomicExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.ParenExpression) },
      { ALT: () => this.SUBRULE(this.RawMemAccess) },
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(Number) },
      { ALT: () => this.CONSUME(FPNumber) }
    ]);
  });
  private RawMemAccess = this.RULE("RawMemAccess", () => {
    this.CONSUME(RawAccess);
    this.CONSUME(LBracket);
    this.SUBRULE(this.MathExpression);
    this.CONSUME(RBracket);
  });
  // Actions you can perform like coils, assignments, etc.
  private ActionExpression = this.RULE("ActionExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.CoilExpression) },
      { ALT: () => this.SUBRULE(this.AssignmentExpression) },
      { ALT: () => this.SUBRULE(this.CallExpression) }
    ]);
  });
  // Identifier = MathExpression
  private AssignmentExpression = this.RULE("AssignmentExpression", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Assignment);
    this.OR([
      { ALT: () => this.SUBRULE(this.MathExpression) },
      { ALT: () => this.CONSUME(Strings) }
    ]);
  });
  // Call a built in function
  private CallExpression = this.RULE("CallExpression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.MessageExpression) },
      { ALT: () => this.SUBRULE(this.BitOpExpression) },
      { ALT: () => this.SUBRULE(this.BitTestExpression) },
      { ALT: () => this.SUBRULE(this.BTWWTBExpression) },
      { ALT: () => this.SUBRULE(this.ShiftExpression) },
      { ALT: () => this.SUBRULE(this.SetResetExpression) },
      { ALT: () => this.SUBRULE(this.JumpExpression) }
    ]);
  });
  private MessageExpression = this.RULE("MessageExpression", () => {
    this.CONSUME(MSG);
    // Needs to result in a number
    this.SUBRULE(this.MathExpression);
  });
  private SetResetExpression = this.RULE("SetResetExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(SET) },
      { ALT: () => this.CONSUME(RST) }
    ]);
    this.CONSUME(Identifier);
  });
  private ShiftExpression = this.RULE("ShiftExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(LSHIFT) },
      { ALT: () => this.CONSUME(RSHIFT) }
    ]);
    this.CONSUME(Identifier);
    this.CONSUME(Number);
  });
  private BitOpExpression = this.RULE("BitOpExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(BITSET) },
      { ALT: () => this.CONSUME(BITRST) }
    ]);
    this.CONSUME(Identifier);
    this.CONSUME(Number);
  });
  private BitTestExpression = this.RULE("BitTestExpression", () => {
    this.CONSUME(BITTST);
    this.CONSUME1(Identifier);
    this.CONSUME(Number);
    this.OPTION(() => {
      this.CONSUME2(Identifier);
    });
  });
  private BTWWTBExpression = this.RULE("BTWWTBExpression", () => {
    this.OR([
      { ALT: () => this.CONSUME(BTW) },
      { ALT: () => this.CONSUME(WTB) }
    ]);
    this.CONSUME1(Identifier);
    this.CONSUME2(Identifier);
    this.OPTION(() => {
      this.CONSUME(Number);
    });
  });
  private JumpExpression = this.RULE("JumpExpression", () => {
    this.CONSUME(JMP);
    // Needs to result in a number
    this.CONSUME(Identifier);
  });
  // Coils, which are (Identifier)
  private CoilExpression = this.RULE("CoilExpression", () => {
    this.CONSUME(LParen);
    this.CONSUME(Identifier);
    this.CONSUME(RParen);
  });
}

export function createPLCParser() {
  return new CentroidPLCParser();
}
