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
textTokens.forEach(symbolName => {
  if (symbolName.length == 0) return;
  symbols.push({ name: symbolName, documentation: "", kind: process.argv[3] });
});
console.log(JSON.stringify(symbols, null, 4));
