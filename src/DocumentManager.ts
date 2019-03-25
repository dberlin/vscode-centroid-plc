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
import { FileTries } from "./FileTries";
import machine_params from "./json/machine_parameters.json";
import sv_system_variables from "./json/sv_system_variables.json";
import { getSymbolTypeFromString, SymbolInfo, SymbolType } from "./SymbolInfo";
import {
  getRegexFromWordArray,
  getSymbolByName,
  isSystemSymbolName
} from "./util";

import { BaseDocumentSymbolManagerClass } from "./vscode-centroid-common/BaseDocumentManager.js";
import { createPLCParser } from "./CentroidPLCParser";

const typedVariableWithComment = /^\s*([a-zA-Z0-9_]+)\s*IS\s*((W|DW|FW|DFW|INP|JPI|MEM|OUT|JPO|STG|FSTG|T|PD|(?:SV_.*?))(\d+))\s*(;.*)?$/gm;
const constantVariableWithComment = /^\s*([a-zA-Z0-9_]+)\s*IS\s*(\d+|TRUE|FALSE)\\s*(;.*)?$/gim;

export function isStageSymbol(symbolInfo: SymbolInfo) {
  return (
    symbolInfo.symbolType == SymbolType.Stage ||
    symbolInfo.symbolType == SymbolType.FastStage
  );
}

function isComment(str: string) {
  return str.length > 1 && str[0] == ";";
}

/**
 * Add a little markdown formatting to doc comments
 * @param comment - comment to format
 */
function formatDocComment(comment: string) {
  return "### ".concat(comment.substring(1).trimLeft());
}

class DocumentSymbolManagerClass extends BaseDocumentSymbolManagerClass {
  private PLCParser = createPLCParser();
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
    if (this.hasDocument(document)) return;
    const filename = this.normalizePathtoDoc(document);
    const fileTries = new FileTries();
    this.tries.set(filename, fileTries);
    super.parseAndAddDocument(document);

    // Parse out all the symbols
    this.parseSymbolsUsingRegex(
      fileTries,
      document,
      typedVariableWithComment,
      this.getSymbolInfoFromTypedVariable
    );
    this.parseSymbolsUsingRegex(
      fileTries,
      document,
      constantVariableWithComment,
      this.getSymbolInfoFromConstantVariable
    );
    fileTries.freeze();
    this.findStageSymbols(document);
  }
  /**
   * Find PLC stage symbols in our document.
   *
   * @param document - document to process
   * @param fileTries
   */
  private findStageSymbols(document: vscode.TextDocument) {
    const fileTries = this.getTriesForDocument(document);
    if (fileTries === undefined) return;

    const docText = document.getText();
    const stageSymbolArray = (fileTries as FileTries).getStageNames();

    if (stageSymbolArray.length > 0) {
      const stageRegex = getRegexFromWordArray(stageSymbolArray);
      let lastStage = null;
      let matches;
      while ((matches = stageRegex.exec(docText))) {
        let symbol = fileTries.getSymbol(matches[1]);
        if (!symbol) continue;
        symbol.symbolDefPos = matches.index;
        if (lastStage) {
          let originalPlace = document.positionAt(matches.index);
          // Place the end of the last stage at the end of the line before this
          // stage starts
          lastStage.symbolDefEndPos =
            document.offsetAt(originalPlace.with(undefined, 0)) - 1;
        }
        lastStage = symbol;
      }
      if (lastStage) lastStage.symbolDefEndPos = docText.length;
    }
  }

  /**
   * Convert a capture array into a typed variable symbol.
   *
   * The current format of the capture array is an internal detail.
   * @remarks This handles the X IS <type> style of variable
   * @param captures - An array of captured strings from micromatch.
   * @returns Newly created symbol info, or null if we could not create symbol info.
   */
  private getSymbolInfoFromTypedVariable(
    document: vscode.TextDocument,
    captures: RegExpExecArray
  ) {
    // Ignore system variables here, we process them separately
    if (isSystemSymbolName(captures[1])) return null;

    // If this is a system variable type, it may be an alias for an existing
    // system symbol, in which case we will copy the documentation.
    if (captures[2].startsWith("SV_")) {
      const sym = getSymbolByName(document, captures[2]) as SymbolInfo;
      if (sym) {
        let doc = sym.documentation as vscode.MarkdownString;
        if (doc === undefined) return null;

        return new SymbolInfo(
          captures[1],
          sym.symbolType,
          sym.detail,
          sym.symbolNumber,
          sym.symbolValue,
          "#### This is an alias for " + sym.label + "\n\n" + doc.value,
          captures.index
        );
      }
    }
    const symbolType = getSymbolTypeFromString(captures[3]);
    if (symbolType === undefined) return null;

    const possibleComment = !captures[5] ? "" : captures[5].trim();
    const symbolDoc = isComment(possibleComment)
      ? formatDocComment(possibleComment)
      : "";
    return new SymbolInfo(
      captures[1],
      symbolType,
      captures[2],
      parseInt(captures[4]),
      0,
      symbolDoc,
      captures.index
    );
  }

  /**
   * Convert a capture array into a constant symbol.
   *
   * The current format of the capture array is an internal detail.
   * @remarks This handles the X IS <value> style of variable
   * @param captures - An array of captured strings from micromatch.
   * @returns Newly created symbol info, or null if we could not create symbol info.
   */
  private getSymbolInfoFromConstantVariable(
    document: vscode.TextDocument,
    captures: RegExpExecArray
  ) {
    // Ignore system variables here, we process them separately
    if (isSystemSymbolName(captures[1])) return null;

    const possibleComment = !captures[3] ? "" : captures[3].trim();
    const symbolDoc = isComment(possibleComment)
      ? formatDocComment(possibleComment)
      : "";
    return new SymbolInfo(
      captures[1],
      SymbolType.MessageOrConstant,
      captures[2],
      0,
      parseInt(captures[2]),
      symbolDoc,
      captures.index
    );
  }
  getTriesForDocument(document: vscode.TextDocument): FileTries {
    return super.getTriesForDocument(document) as FileTries;
  }
}
export const DocumentSymbolManager = new DocumentSymbolManagerClass();
