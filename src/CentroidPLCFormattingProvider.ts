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
import { Token } from "antlr4ts";
import * as vscode from "vscode";
import { CentroidPLCLexer } from "./CentroidPLCLexer";
import formatting_tokens from "./json/formatting_tokens.json";
import { createPLCLexerForText } from "./util";

const systemVariableTokens = new Set(formatting_tokens);

export class CentroidPLCFormattingProvider
  implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    console.time("Fixing keywords");
    const upperCaseEdits = this.fixKeywordCase(document);
    console.timeEnd("Fixing keywords");
    const results: vscode.TextEdit[] = [];
    return results.concat(upperCaseEdits);
  }
  private getRangeForMatch(document: vscode.TextDocument, token: Token) {
    return new vscode.Range(
      // These are different kinds of ranges, hence the offsetting
      document.positionAt(token.startIndex),
      document.positionAt(token.stopIndex + 1),
    );
  }
  private isKeywordOrSystemVar(token: Token) {
    return (
      (token.type === CentroidPLCLexer.Identifier &&
        systemVariableTokens.has(token.text!.toUpperCase())) ||
      (token.type >= CentroidPLCLexer.MathCall &&
        token.type <= CentroidPLCLexer.RSHIFT)
    );
  }
  private fixKeywordCase(document: vscode.TextDocument) {
    const edits = [];
    const docText = document.getText();
    const lexer = createPLCLexerForText(docText);
    const tokens = lexer.getAllTokens();
    if (tokens.length === 0) {
      return [];
    }
    for (const token of tokens) {
      if (this.isKeywordOrSystemVar(token)) {
        const matchStr = token.text!;
        if (token.stopIndex === -1) {
          continue;
        }
        // Skip uppercasing if not necessary
        const upperStr = matchStr.toUpperCase();
        if (upperStr !== matchStr) {
          const range = this.getRangeForMatch(document, token);
          edits.push(new vscode.TextEdit(range, upperStr));
          continue;
        }
      }
    }
    return edits;
  }
}
