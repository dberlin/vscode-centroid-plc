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
      const hoverText = new vscode.MarkdownString();
      let declString: string;
      const symbolPos =
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
      return new vscode.Hover(hoverText);
    }
  }
}
