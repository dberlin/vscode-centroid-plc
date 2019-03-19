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
    if (
      sym &&
      (sym.symbolDefPos !== -1 || sym.symbolDeclPos !== -1) &&
      !isSystemSymbol(sym)
    ) {
      // Jump to declaration for things that have no definition, since this is
      // what users seem to expect.
      return new vscode.Location(
        document.uri,
        document.positionAt(
          sym.symbolDefPos !== -1 ? sym.symbolDefPos : sym.symbolDeclPos
        )
      );
    }
    return null;
  }
}
