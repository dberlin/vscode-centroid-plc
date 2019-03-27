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

import { createPLCLexer, createPLCParser } from "../CentroidPLCParser";
import * as fs from "fs";
let CentroidPLCLexer = createPLCLexer();
let CentroidPLCParser = createPLCParser();
if (process.argv.length < 3) {
  console.log("usage: ts-node testGrammar.ts <input file>");
  process.exit();
}
const docText = fs.readFileSync(process.argv[2]).toString();
const lexingResults = CentroidPLCLexer.tokenize(docText);

CentroidPLCParser.input = lexingResults.tokens;
const cst = CentroidPLCParser.PLCProgram();
if (CentroidPLCParser.errors.length != 0)
  console.log(
    `Got parser errors from ${process.argv[2]}, errors were ${JSON.stringify(
      CentroidPLCParser.errors,
      null,
      4
    )}`
  );
