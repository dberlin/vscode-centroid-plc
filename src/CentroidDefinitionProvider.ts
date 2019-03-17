"use strict";
import * as vscode from "vscode";
import { isSystemSymbol, getSymbolForPosition } from "./util";

export class CentroidDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<
    vscode.Location | vscode.Location[] | vscode.LocationLink[]
  > {
    let sym = getSymbolForPosition(document, position);
    if (sym && sym.symbolDefPos != -1 && !isSystemSymbol(sym)) {
      return new vscode.Location(
        document.uri,
        document.positionAt(sym.symbolDefPos)
      );
    }
    return null;
  }
}
