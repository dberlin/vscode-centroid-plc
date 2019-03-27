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
import * as vscode from "vscode";
import formatting_tokens from "./json/formatting_tokens.json";
import { createPLCLexerForText } from "./util.js";
import { Token, Vocabulary } from "antlr4ts";

const systemVariableTokens = new Set(formatting_tokens);

export class CentroidPLCFormattingProvider
  implements vscode.DocumentFormattingEditProvider {
  private getRangeForMatch(document: vscode.TextDocument, token: Token) {
    return new vscode.Range(
      // These are different kinds of ranges, hence the offsetting
      document.positionAt(token.startIndex),
      document.positionAt(token.stopIndex + 1)
    );
  }
  private isKeywordOrSystemVar(token: Token, vocabulary: Vocabulary) {
    return (
      (vocabulary.getDisplayName(token.type) === "Identifier" &&
        systemVariableTokens.has((token.text as string).toUpperCase())) ||
      /*keywordTokens.has(token.tokenType.name)*/ 0
    );
  }
  private fixKeywordCase(document: vscode.TextDocument) {
    let edits = [];
    const docText = document.getText();
    const lexer = createPLCLexerForText(docText);
    let tokens = lexer.getAllTokens();
    if (tokens.length == 0) return [];
    for (let token of tokens) {
      if (this.isKeywordOrSystemVar(token, lexer.vocabulary)) {
        const matchStr = token.text as string;
        if (token.stopIndex == -1) continue;
        // Skip uppercasing if not necessary
        let upperStr = matchStr.toUpperCase();
        if (upperStr !== matchStr) {
          let range = this.getRangeForMatch(document, token);
          edits.push(new vscode.TextEdit(range, upperStr));
          continue;
        }
      }
    }
    return edits;
  }
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    console.time("Fixing keywords");
    let upperCaseEdits = this.fixKeywordCase(document);
    console.timeEnd("Fixing keywords");
    let results: vscode.TextEdit[] = [];
    return results.concat(upperCaseEdits);
  }
}
