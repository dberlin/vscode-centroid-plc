import * as vscode from "vscode";
import { DocumentSymbolManager } from "./DocumentManager";

export class CentroidDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<
    vscode.SymbolInformation[] | vscode.DocumentSymbol[]
  > {
    // Get the stage symbols from the tries.
    let fileTries = DocumentSymbolManager.getTriesForDocument(document);
    if (!fileTries) return null;
    let stageSymbols = fileTries.getStageSymbols();

    // Convert stage symbols to DocumentSymbols. We pretend they are functions
    // and do a little work to convert the symbol positions (which say where the
    // name starts and the stage ends) to where the name starts and ends and the
    // stage starts and ends.

    return <vscode.DocumentSymbol[]>stageSymbols
      .map(val => {
        if (val.symbolDefPos === -1) return null;
        let originalPos = document.positionAt(val.symbolDefPos);
        // Move the start to the beginning of the line
        let symRange = new vscode.Range(
          originalPos.with(undefined, 0),
          document.positionAt(val.symbolDefEndPos)
        );
        // Move the name end to the end of the name
        let symNameRange = new vscode.Range(
          originalPos,
          originalPos.with(undefined, originalPos.character + val.label.length)
        );

        return new vscode.DocumentSymbol(
          val.label,
          val.detail || "",
          vscode.SymbolKind.Function,
          symRange,
          symNameRange
        );
      })
      .filter(obj => obj);
  }
}
