"use strict";
import * as vscode from "vscode";
import { Trie } from "tiny-trie";
import * as path from "path";
import * as SymbolInfo from "./SymbolInfo";
import * as micromatch from "micromatch";
import { isUndefined } from "util";

const typedVariableWithComment: string =
  "+([a-zA-Z0-9_])*([[:blank:]])IS*([[:blank:]])((W|DW|FW|DFW|INP|JPI|MEM|OUT|JPO|STG|FSTG|T|PD|SV_PLC_FUNCTION_|SV_PC_KEYBOARD_KEY_|SV_SKIN_EVENT_|SV_M94_M95_)([0-9]+))*";
const constantVariableWithComment: string =
  "+([a-zA-Z0-9_])*([[:blank:]])IS*([[:blank:]])([0-9]+|TRUE|FALSE)*";
class FileTries {
  private allSymbols: Trie = new Trie();
  private constantSymbols: Trie = new Trie();
  private typedSymbols: Trie = new Trie();
  private symbolMap: Map<string, SymbolInfo.SymbolInfo> = new Map();

  /**
   * Test whether we have any information about a named symbol.
   *
   * @param symbolName - Symbol name to look for.
   * @returns Whether the symbol was found.  This will be true if we processed the symbol, even
   * if various forms of lookups may not find it due to type not matching, etc.
   */
  contains(symbolName: string): boolean {
    return this.allSymbols.test(symbolName);
  }

  /**
   * Add a symbol to the symbol tries.
   *
   * This function takes care of understanding the type of the symbol and adding it to the relevant tries.
   * @param symbolInfo - Symbol to add to tries.
   */
  add(symbolInfo: SymbolInfo.SymbolInfo) {
    let name = symbolInfo.symbolName;
    if (symbolInfo.symbolType == SymbolInfo.SymbolType.MessageOrConstant) {
      this.constantSymbols.insert(name);
    } else {
      this.typedSymbols.insert(name);
    }
    this.allSymbols.insert(name);
    this.symbolMap.set(name, symbolInfo);
  }

  /**
   * Return information about a named symbol.
   *
   * @param symbolName - Symbol name to look for.
   * @returns The found symbol or null.
   */
  getSymbol(symbolName: string): SymbolInfo.SymbolInfo {
    return this.symbolMap.get(symbolName);
  }
}

class DocumentSymbolManagerClass {
  private tries: Map<string, FileTries> = new Map<string, FileTries>();

  init(context: vscode.ExtensionContext) {}

  // Normalize path of document filename
  private normalizePathtoDoc(document: vscode.TextDocument) {
    return path.normalize(vscode.workspace.asRelativePath(document.fileName));
  }

  private isComment(str: string) {
    return str.length > 1 && str[0] == ";";
  }

  // Parse and add a document to our list of managed documents
  parseAndAddDocument(document: vscode.TextDocument) {
    let filename = this.normalizePathtoDoc(document);
    if (this.tries.has(filename)) {
      return;
    }
    this.tries.set(filename, new FileTries());

    // Parse out the symbols
    let lineNum: number;
    for (lineNum = 0; lineNum < document.lineCount; ++lineNum) {
      let line = document.lineAt(lineNum);
      let captures: string[];
      let symbolInfo: SymbolInfo.SymbolInfo = null;

      // See if it's a variable with an optional comment or if it is a variable that represents a constant
      if (
        (captures = micromatch.capture(typedVariableWithComment, line.text))
      ) {
        symbolInfo = this.getSymbolInfoFromTypedVariable(captures);
      } else if (
        (captures = micromatch.capture(constantVariableWithComment, line.text))
      ) {
        symbolInfo = this.getSymbolInfoFromConstantVariable(captures);
      }
      if (!symbolInfo) continue;

      // Set the line number we found it on
      symbolInfo.symbolLine = line.lineNumber;
      let fileTries = this.tries.get(filename);
      if (fileTries.contains(symbolInfo.symbolName)) {
        console.log("Found already existing symbol!");
        return;
      }
      fileTries.add(symbolInfo);
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
  private getSymbolInfoFromTypedVariable(captures: Array<string>) {
    let symbolType = captures[4].startsWith("SV")
      ? SymbolInfo.SymbolType.SystemVariable
      : SymbolInfo.getSymbolTypeFromString(captures[4]);
    if (isUndefined(symbolType)) return null;

    let possibleComment = captures[6].trim();
    let symbolDoc = this.isComment(possibleComment)
      ? possibleComment.substring(1).trimLeft()
      : "";
    return new SymbolInfo.SymbolInfo(
      captures[0],
      symbolType,
      captures[3],
      parseInt(captures[5]),
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
    let symbolType = SymbolInfo.SymbolType.MessageOrConstant;
    let possibleComment = captures[4].trim();
    let symbolDoc = this.isComment(possibleComment)
      ? possibleComment.substring(1).trimLeft()
      : "";
    return new SymbolInfo.SymbolInfo(
      captures[0],
      symbolType,
      captures[2],
      0,
      parseInt(captures[3]),
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
