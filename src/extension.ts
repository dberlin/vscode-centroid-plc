"use strict";
import * as vscode from "vscode";
import { CentroidCompletionProvider } from "./CentroidCompletionProvider";
import { CentroidDeclarationProvider } from "./CentroidDeclarationProvider";
import { CentroidDefinitionProvider } from "./CentroidDefinitionProvider";
import { CentroidDocumentSymbolProvider } from "./CentroidDocumentSymbolProvider";
import { CentroidHoverProvider } from "./CentroidHoverProvider";
import { CentroidPLCFormattingProvider } from "./CentroidPLCFormattingProvider";
import { DocumentSymbolManager } from "./DocumentManager";
import { CentroidReferenceProvider } from "./vscode-centroid-common/CentroidReferenceProvider";

const centroidScheme = { language: "centroid-plc", scheme: "file" };

export function activate(context: vscode.ExtensionContext) {
  console.log("Activating!");
  console.time("Initialize document manager");
  DocumentSymbolManager.init(context);
  console.timeEnd("Initialize document manager");
  console.time("Initialize subscriptions");
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      centroidScheme,
      new CentroidCompletionProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDeclarationProvider(
      centroidScheme,
      new CentroidDeclarationProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      centroidScheme,
      new CentroidDefinitionProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      centroidScheme,
      new CentroidPLCFormattingProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      centroidScheme,
      new CentroidDocumentSymbolProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      centroidScheme,
      new CentroidHoverProvider()
    )
  );

  context.subscriptions.push(
    vscode.languages.registerReferenceProvider(
      centroidScheme,
      new CentroidReferenceProvider()
    )
  );
  console.timeEnd("Initialize subscriptions");
  console.time("Parse documents");
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
  console.timeEnd("Parse documents");
}
