"use strict";
import machine_params from "./json/machine_parameters.json";
import sv_system_variables from "./json/sv_system_variables.json";
import * as path from "path";
import { Trie } from "tiny-trie";
import * as vscode from "vscode";
import { getSymbolTypeFromString, SymbolInfo, SymbolType } from "./SymbolInfo";
import { isSystemSymbolName } from "./util";

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
  private typeSymbols: Trie = new Trie();
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
    this.typeSymbols.freeze();
  }
  /**
   * Return the names of all stage variables in the trie.
   */
  getStageNames(): string[] {
    return <string[]>this.stageSymbols.search("", { prefix: true });
  }
  /**
   * Return the symbols for all the stage variables in the trie;
   */
  getStageSymbols(): SymbolInfo[] {
    let stageNames = this.getStageNames();
    return stageNames.map((val, idx, arr) => {
      return <SymbolInfo>this.getSymbol(val);
    });
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

/**
 * Add a little markdown formatting to doc comments
 * @param comment - comment to format
 */
function formatDocComment(comment: string) {
  return "### ".concat(comment.substring(1).trimLeft());
}

class DocumentSymbolManagerClass {
  private tries: Map<string, FileTries> = new Map<string, FileTries>();
  private systemSymbols: SymbolInfo[] = [];
  init(context: vscode.ExtensionContext) {
    this.processSymbolList(machine_params);
    this.processSymbolList(sv_system_variables);
  }
  private processSymbolList(
    symList: { kind: string; documentation: string; name: string }[]
  ) {
    symList.forEach((val, index, arr) => {
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
      // Set the position we found it as
      symbolInfo.symbolDeclPos = captures.index;
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
    // Add system symbols
    // In theory we should only do this once, but it takes no appreciable time/memory anyway
    for (var sym of this.systemSymbols) {
      fileTries.add(sym);
    }
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
    this.findStageSymbols(document, docText, fileTries);
  }
  private findStageSymbols(
    document: vscode.TextDocument,
    docText: string,
    fileTries: FileTries
  ) {
    let stageSymbolArray = fileTries.getStageNames();
    if (stageSymbolArray.length > 0) {
      let stageRegex = new RegExp(
        "(?<=^\\s*)(" + stageSymbolArray.join("|") + ")(?=\\s*$)",
        "mg"
      );
      let lastStage = null;
      let matches;
      while ((matches = stageRegex.exec(docText))) {
        let symbol = fileTries.getSymbol(matches[1]);
        if (!symbol) continue;
        symbol.symbolDefPos = matches.index;
        if (lastStage) {
          let originalPlace = document.positionAt(matches.index);
          // Place the end of the last stage at the end of the line before this stage starts
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
  private getSymbolInfoFromTypedVariable(captures: Array<string>) {
    // Ignore system variables here, we process them separately
    if (isSystemSymbolName(captures[1])) return null;

    let symbolType = getSymbolTypeFromString(captures[3]);
    if (!symbolType) return null;

    let possibleComment = !captures[5] ? "" : captures[5].trim();
    let symbolDoc = isComment(possibleComment)
      ? formatDocComment(possibleComment)
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
    // Ignore system variables here, we process them separately
    if (isSystemSymbolName(captures[1])) return null;

    let symbolType = SymbolType.MessageOrConstant;
    let possibleComment = !captures[3] ? "" : captures[3].trim();
    let symbolDoc = isComment(possibleComment)
      ? formatDocComment(possibleComment)
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
