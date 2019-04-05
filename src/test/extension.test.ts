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
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import * as extension from "../extension";
import { createPLCLexerForText, createPLCParserForText } from "../util";
const testFilePath = path.join(__dirname + "/../../testfiles/");
import {
  DocumentSymbolManager,
  DocumentSymbolManagerClass,
} from "../DocumentManager";
import { FileTries } from "../FileTries";

suite("Extension Tests", () => {
  test("Source code lexing", async () => {
    for (const fileName of fs.readdirSync(testFilePath)) {
      const docText = fs
        .readFileSync(path.join(`${testFilePath}/${fileName}`))
        .toString();

      const CentroidPLCLexer = createPLCLexerForText(docText);
      try {
        const lexingResults = CentroidPLCLexer.getAllTokens();
        assert.notStrictEqual(
          lexingResults.length,
          0,
          `Should have found some tokens parsing ${fileName}`,
        );
      } catch (err) {
        assert.fail("`Lexer hit an error parsing ${fileName}`");
      }
    }
  });
  test("Source code parsing", async function() {
    this.timeout(5000);
    for (const fileName of fs.readdirSync(testFilePath)) {
      const docText = fs
        .readFileSync(path.join(`${testFilePath}/${fileName}`))
        .toString();
      const parser = createPLCParserForText(docText);
      try {
        const tree = parser.plcProgram();
        assert.strictEqual(
          parser.numberOfSyntaxErrors,
          0,
          `Parser hit an error parsing ${fileName}`,
        );
      } catch (err) {
        assert.fail(`Parser hit an error in ${fileName}`);
      }
    }
  });
  test("Document symbol manager parsing", async function() {
    this.timeout(30000);
    const manager = new DocumentSymbolManagerClass();
    for (const fileName of fs.readdirSync(testFilePath)) {
      const textDocument = await vscode.workspace.openTextDocument(
        path.join(`${testFilePath}/${fileName}`),
      );
      manager.parseAndAddDocument(textDocument);
      const fileTries = manager.getTriesForDocument(textDocument);
      assert.notStrictEqual(
        fileTries,
        undefined,
        `The trie for the ${fileName} should not be undefined`,
      );
      const completions = (fileTries as FileTries).getAllCompletions("");
      assert.notDeepStrictEqual(
        completions.length,
        0,
        `The trie for the ${fileName} should have symbols in it`,
      );
    }
  });
});
