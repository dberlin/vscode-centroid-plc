// Lexer for Centroid PLC Code

import {
  createToken,
  TokenType,
  Lexer,
  Parser,
  IToken,
  ILexingError,
  IRecognitionException
} from "chevrotain";

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED
});
const Comment = createToken({
  name: "Comment",
  pattern: /;.*/
});
const Strings = createToken({
  name: "String",
  pattern: /"(?:\\["\\]|[^\n"\\])*"/
});
const FPNumber = createToken({
  name: "FPNumber",
  pattern: /(?:[0-9]+)?\.[0-9]+/
});
const Number = createToken({
  name: "Number",
  pattern: /[0-9]+/
});
const LParen = createToken({
  name: "LParen",
  pattern: "("
});
const RParen = createToken({
  name: "RParen",
  pattern: ")"
});
const LBracket = createToken({
  name: "LBracket",
  pattern: "["
});
const RBracket = createToken({
  name: "RBracket",
  pattern: "]"
});
const Comma = createToken({ name: "Comma", pattern: "," });
const RelOp = createToken({ name: "RelOp", pattern: /<|>|<=|>=|!=|==/ });
const MathOp = createToken({ name: "MathOp", pattern: /\/|\*|\+|\-|\%/ });
const LogicalOp = createToken({
  name: "LogicalOp",
  pattern: /\!|&&|\|\||XOR|\^/
});
const Assignment = createToken({
  name: "Assignment",
  pattern: "="
});
const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_\d]+/
});

const mathCalls = [
  "ABS",
  "ACOS",
  "ASIN",
  "ATAN2",
  "ATAN",
  "COS",
  "DIST2",
  "DIST3",
  "LSHIFT",
  "POW",
  "RSHIFT",
  "SIN",
  "SQRT",
  "TAN"
];
const keywordList = [
  "BITRST",
  "BITSET",
  "BITTST",
  "BTW",
  "ELSE",
  "FALSE",
  "IF",
  "IS",
  "JMP",
  "MSG",
  "RST",
  "SET",
  "THEN",
  "TRUE",
  "WTB"
];
export const Keywords = keywordList.map(val => {
  return createToken({ name: val, pattern: new RegExp(val, "i") });
});
const allTokens: TokenType[] = [
  WhiteSpace,
  Comment,
  Strings,
  LParen,
  RParen,
  LBracket,
  RBracket,
  Comma,
  RelOp,
  MathOp,
  LogicalOp,
  Assignment
]
  .concat(Keywords)
  .concat([Identifier, FPNumber, Number]);

export let CentroidPLCLexer = new Lexer(allTokens);
