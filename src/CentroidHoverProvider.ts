"use strict";
import * as vscode from "vscode";
import { SymbolType } from "./SymbolInfo";
import { getSymbolForPosition } from "./util";

export class CentroidHoverProvider implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    /* See if we have the symbol */
    let sym = getSymbolForPosition(document, position);
    if (sym) {
      let hoverText = new vscode.MarkdownString();
      let declString: string;
      let symbolPos = document.positionAt(sym.symbolPos);
      /* Don't produce a hover for the same position we declared the symbol on */
      if (position.line == symbolPos.line) return null;
      /* Produce a cleaned up declaration line for the symbol */
      if (sym.symbolType == SymbolType.MessageOrConstant) {
        declString = sym.label.concat(" IS ", sym.symbolValue.toString());
      } else {
        declString = sym.label.concat(" IS ", <string>sym.detail);
      }
      /* Append the declaration line first, then any documentation */
      hoverText.appendCodeblock(declString, "centroid-plc");
      hoverText.appendMarkdown(<string>sym.documentation);
      let hover = new vscode.Hover(hoverText);
      return hover;
    }
  }
}
