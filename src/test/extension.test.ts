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
import { CentroidPLCLexer } from "../CentroidPLCLexer";
import * as fs from "fs";
import * as path from "path";
let testFilePath = path.join(__dirname + "/../../testfiles/");

suite("Extension Tests", () => {
  test("Source code lexing", async function() {
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
});
