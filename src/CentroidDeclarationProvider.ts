"use strict";
import * as vscode from "vscode";
import { isSystemSymbol, getSymbolForPosition } from "./util";

export class CentroidDeclarationProvider implements vscode.DeclarationProvider {
  provideDeclaration(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<
    vscode.Location | vscode.Location[] | vscode.LocationLink[]
  > {
    let sym = getSymbolForPosition(document, position);
    if (sym && !isSystemSymbol(sym)) {
      return new vscode.Location(
        document.uri,
        document.positionAt(sym.symbolPos)
      );
    }
    return null;
  }
}
