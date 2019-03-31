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
import { CommonTokenStream } from "antlr4ts";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeWalker } from "antlr4ts/tree/ParseTreeWalker";
import * as vscode from "vscode";
import { CentroidPLCParser } from "./CentroidPLCParser";
import { CentroidSymbolParseListener } from "./CentroidSymbolParseListener";
import { FileTries } from "./FileTries";
import machine_params from "./json/machine_parameters.json";
import sv_system_variables from "./json/sv_system_variables.json";
import { getSymbolTypeFromString, SymbolInfo, SymbolType } from "./SymbolInfo";
import { createPLCParserForText } from "./util";
import { BaseDocumentSymbolManagerClass } from "./vscode-centroid-common/BaseDocumentManager";

export function isStageSymbol(symbolInfo: SymbolInfo) {
  return (
    symbolInfo.symbolType == SymbolType.Stage ||
    symbolInfo.symbolType == SymbolType.FastStage
  );
}

export function isComment(str: string) {
  return str.length > 1 && str[0] == ";";
}

/**
 * Add a little markdown formatting to doc comments
 * @param comment - comment to format
 */
export function formatDocComment(comment: string) {
  return "### ".concat(comment.substring(1).trimLeft());
}

export class DocumentSymbolManagerClass extends BaseDocumentSymbolManagerClass {
  private parsers = new Map<string, CentroidPLCParser>();
  constructor() {
    super();
    this.processSymbolList(machine_params);
    this.processSymbolList(sv_system_variables);
  }
  protected processSymbolList(
    symList: { kind: string; documentation: string; name: string }[]
  ) {
    symList.forEach(val => {
      this.systemSymbols.push(
        new SymbolInfo(
          val.name,
          <SymbolType>getSymbolTypeFromString(val.kind),
          val.kind,
          0,
          0,
          val.documentation
        )
      );
    });
  }

  // Parse and add a document to our list of managed documents
  parseAndAddDocument(document: vscode.TextDocument) {
    console.time("Parsing document and processing symbols");
    if (this.hasDocument(document)) return;
    const filename = this.normalizePathtoDoc(document);
    const fileTries = new FileTries();
    this.tries.set(filename, fileTries);
    super.parseAndAddDocument(document);

    const PLCParser = createPLCParserForText(document.getText());
    this.parsers.set(filename, PLCParser);
    try {
      const tree = PLCParser.plcProgram();
      const tokenStream = PLCParser.inputStream as CommonTokenStream;
      const listener = new CentroidSymbolParseListener(
        document,
        fileTries,
        tokenStream
      );
      ParseTreeWalker.DEFAULT.walk(listener as ParseTreeListener, tree);
    } catch (err) {
      console.error(`Error parsing ${document.fileName}: ${err}`);
    }
    console.timeEnd("Parsing document and processing symbols");
    fileTries.freeze();
  }

  protected removeDocumentInternal(document: vscode.TextDocument) {
    super.removeDocumentInternal(document);
    let filename = this.normalizePathtoDoc(document);
    this.parsers.delete(filename);
  }
  getTriesForDocument(document: vscode.TextDocument): FileTries | undefined {
    return super.getTriesForDocument(document) as FileTries | undefined;
  }
  getParserForDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    return this.parsers.get(filename);
  }
}
export const DocumentSymbolManager = new DocumentSymbolManagerClass();
