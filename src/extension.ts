"use strict";
import * as vscode from "vscode";
import { DocumentManager } from "./DocumentManager";
import { SymbolType, getSymbolStringFromType } from "./SymbolInfo";

export class CentroidHoverProvider implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Thenable<vscode.Hover> | null {
    let wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return null;
    }
    let wordText = document.getText(wordRange);
    let tries = DocumentManager.getTriesForDocument(document);
    if (!tries) return null;

    /* See if we have the symbol */
    let sym = tries.getSymbol(wordText);
    if (sym) {
      let hoverText = new vscode.MarkdownString();
      let declString;

      /* Don't produce a hover for the same line we declared the symbol on */
      if (position.line == sym.symbolLine) return null;

      /* Produce a cleaned up declaration line for the symbol */
      if (sym.symbolType == SymbolType.MessageOrConstant) {
        declString = sym.symbolName.concat(" IS ", sym.symbolValue.toString());
      } else {
        declString = sym.symbolName.concat(
          " IS ",
          getSymbolStringFromType(sym.symbolType),
          sym.symbolNumber.toString()
        );
      }
      /* Append the declaration line first, then any documentation */
      hoverText.appendCodeblock(declString, "centroid-plc");
      hoverText.appendMarkdown(sym.symbolDoc);
      let hover = new vscode.Hover(hoverText);
      return Promise.resolve(hover);
    }
  }
}
export async function activate(context: vscode.ExtensionContext) {
  await DocumentManager.init(context);
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "centroid-plc", scheme: "file" },
      new CentroidHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
      if (document.languageId === "centroid-plc") {
        DocumentManager.parseAndAddDocument(document);
      }
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      if (document.languageId === "centroid-plc") {
        DocumentManager.resetDocument(document);
      }
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
      if (document.languageId === "centroid-plc") {
        DocumentManager.removeDocument(document);
      }
    })
  );
  for (let i = 0; i < vscode.workspace.textDocuments.length; ++i) {
    if (vscode.workspace.textDocuments[i].languageId === "centroid-plc") {
      DocumentManager.parseAndAddDocument(vscode.workspace.textDocuments[i]);
    }
  }
}
