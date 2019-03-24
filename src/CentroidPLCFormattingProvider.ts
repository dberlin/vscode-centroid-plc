import * as vscode from "vscode";
import formatting_tokens from "./json/formatting_tokens.json";
import { RegExpAny } from "./util.js";
let stringRegexp = /("(?:\\["\\]|[^\n"\\])*")/gim;
let commentRegexp = /(;.*$)/gim;
const languageKeywords = RegExpAny(
  stringRegexp,
  commentRegexp,
  new RegExp(`(?<=\\b)(${formatting_tokens.join("|")})(?=\\b)`, "mgi")
);

export class CentroidPLCFormattingProvider
  implements vscode.DocumentFormattingEditProvider {
  private getRangeForMatch(
    document: vscode.TextDocument,
    matches: RegExpExecArray,
    matchStr: string
  ) {
    return new vscode.Range(
      document.positionAt(matches.index),
      document.positionAt(matches.index + matchStr.length)
    );
  }
  private fixKeywordCase(document: vscode.TextDocument) {
    let edits = [];
    let matches;
    let docText = document.getText();
    while ((matches = languageKeywords.exec(docText))) {
      // Skip comments
      if (matches[1] || matches[2]) continue;
      let matchStr = matches[3];

      // Special case true and false
      if (matchStr.toUpperCase() === "TRUE") {
        if (matchStr !== "True") {
          let range = this.getRangeForMatch(document, matches, matchStr);
          edits.push(new vscode.TextEdit(range, "True"));
        }
        continue;
      } else if (matchStr.toUpperCase() === "FALSE") {
        if (matchStr !== "False") {
          let range = this.getRangeForMatch(document, matches, matchStr);
          edits.push(new vscode.TextEdit(range, "False"));
        }
        continue;
      }
      // Skip uppercasing if not necessary
      let upperStr = matchStr.toUpperCase();
      if (upperStr !== matchStr) {
        let range = this.getRangeForMatch(document, matches, matchStr);
        edits.push(new vscode.TextEdit(range, upperStr));
        continue;
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
