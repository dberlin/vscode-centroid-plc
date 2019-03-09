"use strict";
import * as vscode from "vscode";
import { DocumentSymbolManager } from "./DocumentManager";
import { SymbolInfo, SymbolType } from "./SymbolInfo";

const centroidScheme = { language: "centroid-plc", scheme: "file" };
/**
 * Convert a (document, position) pair into a word in the document.
 *
 * @param document - VSCode document the position is for.
 * @param position - Position in document to get word for.
 */
function getWordForPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): string | null {
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
): SymbolInfo | null {
  let wordText = getWordForPosition(document, position);
  if (!wordText) return null;
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
      return new vscode.Location(
        document.uri,
        document.positionAt(sym.symbolPos)
      );
    }
    return null;
  }
}

class CentroidReferenceProvider implements vscode.ReferenceProvider {
  provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Location[]> {
    // This may take a while so use a promise.
    return new Promise(resolve => {
      // We use a simple regex to find the occurrences for now
      let wordToLookFor = getWordForPosition(document, position);
      if (!wordToLookFor) {
        resolve([]);
        return;
      }
      let docText = document.getText();
      let regexToUse = RegExp("\\b".concat(wordToLookFor, "\\b"), "g");
      let locationResults: vscode.Location[] = [];

      while (regexToUse.exec(docText) != null) {
        let resultPosition = document.positionAt(regexToUse.lastIndex);
        locationResults.push(new vscode.Location(document.uri, resultPosition));
      }
      resolve(locationResults);
    });
  }
}

class CentroidCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    let wordText = getWordForPosition(document, position);
    let tries = DocumentSymbolManager.getTriesForDocument(document);
    if (!tries) return [];
    let symbolResults = tries.getAllCompletions(!wordText ? "" : wordText);
    return symbolResults;
  }
}

export function activate(context: vscode.ExtensionContext) {
  DocumentSymbolManager.init(context);
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      centroidScheme,
      new CentroidHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDeclarationProvider(
      centroidScheme,
      new CentroidDeclarationProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerReferenceProvider(
      centroidScheme,
      new CentroidReferenceProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      centroidScheme,
      new CentroidCompletionProvider()
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
