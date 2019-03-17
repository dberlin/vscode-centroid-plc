"use strict";
import * as vscode from "vscode";
import { SymbolType } from "./SymbolInfo";
import { getSymbolForPosition, isSystemSymbolName } from "./util";

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
      let symbolPos =
        sym.symbolDeclPos == -1
          ? document.positionAt(0)
          : document.positionAt(sym.symbolDeclPos);
      /* Don't produce a hover for the same position we declared the symbol on */
      if (position.line == symbolPos.line) return null;
      /* Produce a cleaned up declaration line for the symbol */
      switch (sym.symbolType) {
        case SymbolType.MessageOrConstant: {
          declString = sym.label.concat(" IS ", sym.symbolValue.toString());
          break;
        }
        default: {
          declString = sym.label.concat(" IS ", <string>sym.detail);
        }
      }

      /* Append the declaration line first, then any documentation */
      hoverText.appendCodeblock(declString, "centroid-plc");
      if (isSystemSymbolName(sym.label)) {
        hoverText.appendMarkdown("**This is a system defined variable**  \n\n");
      }
      hoverText.appendMarkdown(
        (<vscode.MarkdownString>sym.documentation).value
      );
      let hover = new vscode.Hover(hoverText);
      return hover;
    }
  }
}
