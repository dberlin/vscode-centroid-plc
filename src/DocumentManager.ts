"use strict";
import * as path from "path";
import { Trie } from "tiny-trie";
import * as vscode from "vscode";
import { getSymbolTypeFromString, SymbolInfo, SymbolType } from "./SymbolInfo";

const typedVariableWithComment: RegExp = new RegExp(
  "^\\s*([a-zA-Z0-9_]+)\\s*IS\\s*((W|DW|FW|DFW|INP|JPI|MEM|OUT|JPO|STG|FSTG|T|PD|SV_)([0-9]+))\\s*(;.*)?$",
  "gm"
);
const constantVariableWithComment: RegExp = new RegExp(
  "^\\s*([a-zA-Z0-9_]+)\\s*IS\\s*([0-9]+|TRUE|FALSE)\\s*(;.*)?$",
  "gm"
);
class FileTries {
  private allSymbols: Trie = new Trie();
  private constantSymbols: Trie = new Trie();
  private typedSymbols: Trie = new Trie();
  private stageSymbols: Trie = new Trie();
  private symbolMap: Map<string, SymbolInfo> = new Map();

  getAllCompletions(label: string): SymbolInfo[] {
    let wordResults: string[] = <string[]>(
      this.allSymbols.search(label, { prefix: true })
    );
    let results: SymbolInfo[] = [];
    wordResults.forEach((val, index, arr) => {
      let sym = this.getSymbol(val);
      if (sym) results.push(sym);
    });
    return results;
  }
  /**
   * Test whether we have any information about a named symbol.
   *
   * @param label - Symbol name to look for.
   * @returns Whether the symbol was found.  This will be true if we processed the symbol, even
   * if various forms of lookups may not find it due to type not matching, etc.
   */
  contains(label: string): boolean {
    return this.allSymbols.test(label);
  }

  /**
   * Add a symbol to the symbol tries.
   *
   * This function takes care of understanding the type of the symbol and adding it to the relevant tries.
   * @param symbolInfo - Symbol to add to tries.
   */
  add(symbolInfo: SymbolInfo) {
    let name = symbolInfo.label;
    if (symbolInfo.symbolType == SymbolType.MessageOrConstant) {
      this.constantSymbols.insert(name);
    } else {
      this.typedSymbols.insert(name);
      if (isStageSymbol(symbolInfo)) this.stageSymbols.insert(name);
    }
    this.allSymbols.insert(name);
    this.symbolMap.set(name, symbolInfo);
  }

  /**
   * Return information about a named symbol.
   *
   * @param label - Symbol name to look for.
   * @returns The found symbol or null.
   */
  getSymbol(label: string): SymbolInfo | null {
    let res = this.symbolMap.get(label);
    return !res ? null : res;
  }

  /**
   * Freeze all the tries so no more insertion can take place,
   * and convert them into DAWGs
   */
  freeze() {
    this.allSymbols.freeze();
    this.constantSymbols.freeze();
    this.typedSymbols.freeze();
    this.stageSymbols.freeze();
  }
}

function isStageSymbol(symbolInfo: SymbolInfo) {
  return (
    symbolInfo.symbolType == SymbolType.Stage ||
    symbolInfo.symbolType == SymbolType.FastStage
  );
}

function isComment(str: string) {
  return str.length > 1 && str[0] == ";";
}

class DocumentSymbolManagerClass {
  private tries: Map<string, FileTries> = new Map<string, FileTries>();

  init(context: vscode.ExtensionContext) {}

  // Normalize path of document filename
  private normalizePathtoDoc(document: vscode.TextDocument) {
    return path.normalize(vscode.workspace.asRelativePath(document.fileName));
  }

  private parseSymbolsUsingRegex(
    fileTries: FileTries,
    text: string,
    regex: RegExp,
    callback: {
      (captures: string[]): SymbolInfo | null;
    }
  ) {
    let captures: RegExpExecArray | null;
    while ((captures = regex.exec(text))) {
      let symbolInfo = callback(captures);
      if (!symbolInfo) continue;
      // Set the positoin we found it as
      symbolInfo.symbolPos = captures.index;
      fileTries.add(symbolInfo);
    }
  }
  // Parse and add a document to our list of managed documents
  parseAndAddDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    if (this.tries.has(filename)) {
      return;
    }
    let fileTries = new FileTries();
    this.tries.set(filename, fileTries);

    // Parse out all the symbols
    let docText = document.getText();

    this.parseSymbolsUsingRegex(
      fileTries,
      docText,
      typedVariableWithComment,
      this.getSymbolInfoFromTypedVariable
    );
    this.parseSymbolsUsingRegex(
      fileTries,
      docText,
      constantVariableWithComment,
      this.getSymbolInfoFromConstantVariable
    );
    fileTries.freeze();
  }
  /**
   * Convert a capture array into a typed variable symbol.
   *
   * The current format of the capture array is an internal detail.
   * @remarks This handles the X IS <type> style of variable
   * @param captures - An array of captured strings from micromatch.
   * @returns Newly created symbol info, or null if we could not create symbol info.
   */
  private getSymbolInfoFromTypedVariable(captures: Array<string>) {
    let symbolType = captures[3].startsWith("SV")
      ? SymbolType.SystemVariable
      : getSymbolTypeFromString(captures[3]);
    if (!symbolType) return null;

    let possibleComment = !captures[5] ? "" : captures[5].trim();
    let symbolDoc = isComment(possibleComment)
      ? possibleComment.substring(1).trimLeft()
      : "";
    return new SymbolInfo(
      captures[1],
      symbolType,
      captures[2],
      parseInt(captures[4]),
      0,
      symbolDoc
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
  private getSymbolInfoFromConstantVariable(captures: Array<string>) {
    let symbolType = SymbolType.MessageOrConstant;
    let possibleComment = !captures[3] ? "" : captures[3].trim();
    let symbolDoc = isComment(possibleComment)
      ? possibleComment.substring(1).trimLeft()
      : "";
    return new SymbolInfo(
      captures[1],
      symbolType,
      captures[2],
      0,
      parseInt(captures[2]),
      symbolDoc
    );
  }
  resetDocument(document: vscode.TextDocument) {
    this.removeDocumentInternal(document);
    this.parseAndAddDocument(document);
  }
  removeDocument(document: vscode.TextDocument) {
    this.removeDocumentInternal(document);
  }
  private removeDocumentInternal(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    this.tries.delete(filename);
  }
  getTriesForDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    return this.tries.get(filename);
  }
}
export const DocumentSymbolManager = new DocumentSymbolManagerClass();
