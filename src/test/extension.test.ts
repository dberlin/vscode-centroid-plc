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
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as extension from "../extension";
import { createPLCLexer, createPLCParser } from "../CentroidPLCParser";
import * as fs from "fs";
import * as path from "path";
let testFilePath = path.join(__dirname + "/../../testfiles/");

suite("Extension Tests", () => {
  test("Source code lexing", async function() {
    let CentroidPLCLexer = createPLCLexer();
    for (let fileName of fs.readdirSync(testFilePath)) {
      const docText = fs
        .readFileSync(path.join(testFilePath + fileName))
        .toString();
      const lexingResults = CentroidPLCLexer.tokenize(docText);
      assert.equal(
        lexingResults.errors.length,
        0,
        `Got lexer errors from ${fileName}, errors were ${JSON.stringify(
          lexingResults.errors,
          null,
          4
        )}`
      );
    }
  });
  test("Source code parsing", async function() {
    let CentroidPLCLexer = createPLCLexer();
    let CentroidPLCParser = createPLCParser();
    for (let fileName of fs.readdirSync(testFilePath)) {
      const docText = fs
        .readFileSync(path.join(testFilePath + fileName))
        .toString();
      const lexingResults = CentroidPLCLexer.tokenize(docText);
      assert.equal(
        lexingResults.errors.length,
        0,
        `Got lexer errors from ${fileName}, errors were ${JSON.stringify(
          lexingResults.errors,
          null,
          4
        )}`
      );
      CentroidPLCParser.input = lexingResults.tokens;
      const cst = CentroidPLCParser.PLCProgram();
      assert.equal(
        CentroidPLCParser.errors,
        0,
        `Got parser errors from ${fileName}, errors were ${JSON.stringify(
          CentroidPLCParser.errors,
          null,
          4
        )}`
      );
    }
  });
});
