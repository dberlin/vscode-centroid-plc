// Convert a list of tokens to a set of symbols in JSON
import * as fs from "fs";
if (process.argv.length < 4) {
  console.log("usage: ts-node tokenstosymbols.ts <file with tokens> <kind>");
  process.exit(0);
}
var textTokens = fs
  .readFileSync(process.argv[2])
  .toString()
  .split(/[\r\n]+/);
let symbols: { name: string; documentation: string; kind: string }[] = [];
textTokens.forEach(function(symbolName: string) {
  if (symbolName.length == 0) return;
  symbols.push({ name: symbolName, documentation: "", kind: process.argv[3] });
});
console.log(JSON.stringify(symbols, null, 4));
