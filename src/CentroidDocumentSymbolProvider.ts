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
import { DocumentSymbolManager } from "./DocumentManager";

export class CentroidDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<
    vscode.SymbolInformation[] | vscode.DocumentSymbol[]
  > {
    // Get the stage symbols from the tries.
    const fileTries = DocumentSymbolManager.getTriesForDocument(document);
    if (!fileTries) { return null; }
    const stageSymbols = fileTries.getStageSymbols();

    // Convert stage symbols to DocumentSymbols. We pretend they are functions
    // and do a little work to convert the symbol positions (which say where the
    // name starts and the stage ends) to where the name starts and ends and the
    // stage starts and ends.

    return stageSymbols
      .map((val) => {
        if (val.symbolDefPos === -1) { return null; }
        const originalPos = document.positionAt(val.symbolDefPos);
        // Move the start to the beginning of the line
        const symRange = new vscode.Range(
          originalPos.with(undefined, 0),
          document.positionAt(val.symbolDefEndPos),
        );
        // Move the name end to the end of the name
        const symNameRange = new vscode.Range(
          originalPos,
          originalPos.with(undefined, originalPos.character + val.label.length),
        );

        return new vscode.DocumentSymbol(
          val.label,
          val.detail || "",
          vscode.SymbolKind.Function,
          symRange,
          symNameRange,
        );
      })
      .filter((obj) => obj) as vscode.DocumentSymbol[];
  }
}
