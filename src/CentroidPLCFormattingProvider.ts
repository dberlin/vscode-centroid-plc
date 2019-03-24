import * as vscode from "vscode";
import formatting_tokens from "./json/formatting_tokens.json";
import { Keywords, createPLCLexer } from "./CentroidPLCLexer.js";
import { IToken } from "chevrotain";

const systemVariableTokens = new Set(formatting_tokens);
const keywordTokens = new Set(Keywords.map(kw => kw.name));

export class CentroidPLCFormattingProvider
  implements vscode.DocumentFormattingEditProvider {
  private CentroidPLCLexer = createPLCLexer();
  private getRangeForMatch(document: vscode.TextDocument, token: IToken) {
    return new vscode.Range(
      document.positionAt(token.startOffset),
      document.positionAt(token.endOffset as number)
    );
  }
  private isKeywordOrSystemVar(token: IToken) {
    if (!token.tokenType) return false;
    return (
      (token.tokenType.name == "Identifier" &&
        systemVariableTokens.has(token.image.toUpperCase())) ||
      keywordTokens.has(token.tokenType.name)
    );
  }
  private fixKeywordCase(document: vscode.TextDocument) {
    let edits = [];
    const docText = document.getText();
    const lexerResults = this.CentroidPLCLexer.tokenize(docText);
    if (lexerResults.errors.length != 0) return [];
    for (let token of lexerResults.tokens) {
      if (this.isKeywordOrSystemVar(token)) {
        const matchStr = token.image;
        if (!token.endOffset) continue;
        if (matchStr.toUpperCase() === "TRUE") {
          // Special case true and false
          if (matchStr !== "True") {
            let range = this.getRangeForMatch(document, token);
            edits.push(new vscode.TextEdit(range, "True"));
          }
          continue;
        } else if (matchStr.toUpperCase() === "FALSE") {
          if (matchStr !== "False") {
            let range = this.getRangeForMatch(document, token);
            edits.push(new vscode.TextEdit(range, "False"));
          }
          continue;
        }
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
