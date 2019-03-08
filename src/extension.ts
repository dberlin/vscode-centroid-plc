"use strict";
import * as vscode from "vscode";
import { DocumentSymbolManager } from "./DocumentManager";
import { SymbolType, getSymbolStringFromType, SymbolInfo } from "./SymbolInfo";

/**
 * Convert a (document, position) pair into a word in the document.
 *
 * @param document - VSCode document the position is for.
 * @param position - Position in document to get word for.
 */
function getWordForPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): string {
  let wordRange = document.getWordRangeAtPosition(position);
  if (!wordRange) {
    return null;
  }
  return document.getText(wordRange);
}

/**
 * Return symbol information (if we have any) for a given position in the document.
 *
 * @param document - VSCode document the position is for.
 * @param position - Position in document to get symbol for.
 */
function getSymbolForPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): SymbolInfo {
  let wordText = getWordForPosition(document, position);
  return getSymbolByName(document, wordText);
}

/**
 * Return symbol information (if we have any) for a given name in the document.
 *
 * @param document - VSCode document the symbol is in.
 * @param symbolName - Symbol to try to find information about.
 */
function getSymbolByName(document: vscode.TextDocument, symbolName: string) {
  let tries = DocumentSymbolManager.getTriesForDocument(document);
  if (!tries) return null;

  return tries.getSymbol(symbolName);
}

class CentroidHoverProvider implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Hover | null {
    /* See if we have the symbol */
    let sym = getSymbolForPosition(document, position);
    if (sym) {
      let hoverText = new vscode.MarkdownString();
      let declString: string;

      /* Don't produce a hover for the same line we declared the symbol on */
      if (position.line == sym.symbolLine) return null;

      /* Produce a cleaned up declaration line for the symbol */
      if (sym.symbolType == SymbolType.MessageOrConstant) {
        declString = sym.symbolName.concat(" IS ", sym.symbolValue.toString());
      } else {
        declString = sym.symbolName.concat(" IS ", sym.symbolDeclType);
      }
      /* Append the declaration line first, then any documentation */
      hoverText.appendCodeblock(declString, "centroid-plc");
      hoverText.appendMarkdown(sym.symbolDoc);
      let hover = new vscode.Hover(hoverText);
      return hover;
    }
  }
}

class CentroidDeclarationProvider implements vscode.DeclarationProvider {
  provideDeclaration(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<
    vscode.Location | vscode.Location[] | vscode.LocationLink[]
  > {
    let sym = getSymbolForPosition(document, position);
    if (sym) {
      // We don't have column information
      let position = new vscode.Position(sym.symbolLine, 0);
      return new vscode.Location(document.uri, position);
    }
    return null;
  }
}
export function activate(context: vscode.ExtensionContext) {
  DocumentSymbolManager.init(context);
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: "centroid-plc", scheme: "file" },
      new CentroidHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDeclarationProvider(
      { language: "centroid-plc", scheme: "file" },
      new CentroidDeclarationProvider()
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
      if (document.languageId === "centroid-plc") {
        DocumentSymbolManager.parseAndAddDocument(document);
      }
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      if (document.languageId === "centroid-plc") {
        DocumentSymbolManager.resetDocument(document);
      }
    })
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument) => {
      if (document.languageId === "centroid-plc") {
        DocumentSymbolManager.removeDocument(document);
      }
    })
  );
  for (let i = 0; i < vscode.workspace.textDocuments.length; ++i) {
    if (vscode.workspace.textDocuments[i].languageId === "centroid-plc") {
      DocumentSymbolManager.parseAndAddDocument(
        vscode.workspace.textDocuments[i]
      );
    }
  }
}
