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
import { CstNode, ICstVisitor, IToken } from "chevrotain";
import IntervalTree from "node-interval-tree";
import * as vscode from "vscode";
import { createPLCLexer, createPLCParser } from "./CentroidPLCParser";
import { FileTries } from "./FileTries";
import machine_params from "./json/machine_parameters.json";
import sv_system_variables from "./json/sv_system_variables.json";
import { getSymbolTypeFromString, SymbolInfo, SymbolType } from "./SymbolInfo";
import {
  collectTextOfChildren,
  getSymbolByName,
  isSystemSymbolName
} from "./util";
import { BaseDocumentSymbolManagerClass } from "./vscode-centroid-common/BaseDocumentManager.js";

// This is what the parser returns
type ParserCst = CstNode | CstNode[];

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
  private PLCLexer = createPLCLexer();
  private PLCParser = createPLCParser();
  private BaseCstVisitor = this.PLCParser.getBaseCstVisitorConstructorWithDefaults();

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

    const lexerResults = this.PLCLexer.tokenize(document.getText());
    this.PLCParser.input = lexerResults.tokens;
    const cst = this.PLCParser.PLCProgram();
    let commentRanges = new IntervalTree<IToken>();
    for (let comment of lexerResults.groups["Comments"]) {
      // Ignore comments that are whole line for now
      if (comment.startColumn == 1) continue;
      commentRanges.insert(
        comment.startOffset,
        comment.endOffset as number,
        comment
      );
    }
    let symbolVisitor = getSymbolVisitor(
      this.BaseCstVisitor,
      cst,
      document,
      fileTries,
      commentRanges
    );
    symbolVisitor.processSymbols();

    this.findStageSymbols(document, cst);
    console.timeEnd("Parsing document and processing symbols");
    fileTries.freeze();
  }
  /**
   * Find PLC stage symbols in our document.
   *
   * @param document - document it is for
   * @param cst - concrete syntax tree
   */
  private findStageSymbols(document: vscode.TextDocument, cst: ParserCst) {
    const fileTries = this.getTriesForDocument(document);
    if (fileTries === undefined) return;
    const stageSymbolArray = (fileTries as FileTries).getStageNames();
    // Don't do work if there are no stages
    if (stageSymbolArray.length == 0) return;

    let stageVisitor = getStageVisitor(
      this.BaseCstVisitor,
      cst,
      document,
      fileTries
    );
    stageVisitor.processStages();
  }

  getTriesForDocument(document: vscode.TextDocument): FileTries {
    return super.getTriesForDocument(document) as FileTries;
  }
}
export const DocumentSymbolManager = new DocumentSymbolManagerClass();

type ParseTreeVisitor = new (...args: any[]) => ICstVisitor<any, any>;

// This is unfortunately ugly, but the base class used for the visitor is
// dynamically defined, so we have to dynamically define the visitors.

function getStageVisitor(
  Base: ParseTreeVisitor,
  cst: ParserCst,
  document: vscode.TextDocument,
  fileTries: FileTries
) {
  return new class StageVisitor extends Base {
    // Set of symbol tries to use for lookup
    private cst: ParserCst;
    private document: vscode.TextDocument;
    private fileTries: FileTries;

    constructor(
      cst: ParserCst,
      document: vscode.TextDocument,
      tries: FileTries
    ) {
      super();
      this.cst = cst;
      this.document = document;
      this.fileTries = tries;
    }

    processStages() {
      let stageStack: IToken[] = [];
      this.visit(this.cst, stageStack);

      let endPos = this.document.getText().length;
      while (stageStack.length > 0) {
        let stage = stageStack.pop() as IToken;
        let symbol = this.fileTries.getSymbol(stage.image);
        if (!symbol) continue;
        // Symbol def starts with name starts
        symbol.symbolDefPos = stage.startOffset;
        symbol.symbolDefEndPos = endPos;
        // New end position is the end of the line before ours.
        endPos = stage.startOffset - (stage.startColumn as number) - 1;
      }
    }
    // Only visit stages
    protected Stage(ctx: any, stageStack: IToken[]) {
      // Ignore the unnamed stages
      if (!ctx.Identifier) return;
      // Push the stage name token onto the stack
      stageStack.push(ctx.Identifier[0]);
    }
  }(cst, document, fileTries);
}

function getSymbolVisitor(
  Base: ParseTreeVisitor,
  cst: ParserCst,
  document: vscode.TextDocument,
  fileTries: FileTries,
  commentRanges: IntervalTree<IToken>
) {
  return new class SymbolVisitor extends Base {
    // Set of symbol tries to use for lookup
    private cst: ParserCst;
    private document: vscode.TextDocument;
    private variableTypeRegex = /((W|DW|FW|DFW|INP|JPI|MEM|OUT|JPO|STG|FSTG|T|PD|(?:SV_.*?))(\d+))/i;
    constructor(
      cst: ParserCst,
      document: vscode.TextDocument,
      tries: FileTries,
      commentRanges: IntervalTree<IToken>
    ) {
      super();
      this.cst = cst;
      this.document = document;
    }
    processSymbols() {
      this.visit(this.cst);
    }

    /**
     * Given a line number, find comments that appear on that line. Because
     * comments in the language go from the comment char to the end of the line,
     * there can only be one comment per line.
     *
     * @param lineNum - line number to find comment for
     */
    private getCommentForLine(lineNum: number) {
      let lineRange = this.document.lineAt(lineNum).range;
      let searchResults = commentRanges.search(
        document.offsetAt(lineRange.start),
        document.offsetAt(lineRange.end)
      );
      if (searchResults.length == 0) return "";
      return searchResults[0].image;
    }
    /**
     * Given a symbol defined by a type or variable alias, process it.
     * @param matches - Matched results from the @{variableTypeRegex}
     * @param varNameToken - Token representing the variable name
     * @param typeText - Text of the type
     * @param symbolDoc - Documentation comment that goes with the symbol
     */
    private processTypedSymbol(
      matches: RegExpExecArray,
      varNameToken: IToken,
      typeText: string,
      symbolDoc: string
    ) {
      let varName = varNameToken.image;

      // If this is a system variable type, it may be an alias for an existing
      // system symbol, in which case we will copy the documentation.
      if (isSystemSymbolName(typeText)) {
        const sym = getSymbolByName(document, typeText) as SymbolInfo;
        if (sym) {
          let doc = sym.documentation as vscode.MarkdownString;
          if (doc === undefined) return null;

          let newSym = new SymbolInfo(
            varName,
            sym.symbolType,
            sym.detail,
            sym.symbolNumber,
            sym.symbolValue,
            "#### This is an alias for " + sym.label + "\n\n" + doc.value,
            varNameToken.startOffset
          );
          fileTries.add(newSym);
          return;
        }
      }
      const symbolType = getSymbolTypeFromString(matches[2]);
      if (symbolType === undefined) return;
      let newSym = new SymbolInfo(
        varName,
        symbolType,
        typeText,
        parseInt(matches[3]),
        0,
        symbolDoc,
        varNameToken.startOffset
      );
      fileTries.add(newSym);
    }
    /**
     * Given a symbol defined by a constant or math expression, process it.
     * @param varNameToken - Token representing the variable name
     * @param typeText - Text of the type
     * @param symbolDoc - Documentation comment that goes with the symbol
     */
    private processConstantSymbol(
      varNameToken: IToken,
      typeText: string,
      symbolDoc: string
    ) {
      let varName = varNameToken.image;
      let sym = new SymbolInfo(
        varName,
        SymbolType.MessageOrConstant,
        typeText,
        0,
        parseInt(typeText),
        symbolDoc,
        varNameToken.startOffset
      );
      fileTries.add(sym);
    }

    /**
     * Visit a declaration token type.
     * @param ctx - Context from CST visitor
     */
    protected Declaration(ctx: any) {
      let varNameToken = ctx.Identifier[0];
      let varName = varNameToken.image;

      if (isSystemSymbolName(varName)) return;
      // The token line numbers are 1 based, the document ones are zero based
      let lineNum = varNameToken.startLine - 1;
      const possibleComment = this.getCommentForLine(lineNum).trimRight();

      const symbolDoc = isComment(possibleComment)
        ? formatDocComment(possibleComment)
        : "";

      let typeText = collectTextOfChildren(ctx.MathExpression[0]);
      let matches;
      if ((matches = this.variableTypeRegex.exec(typeText))) {
        this.processTypedSymbol(matches, varNameToken, typeText, symbolDoc);
      } else {
        this.processConstantSymbol(varNameToken, typeText, symbolDoc);
      }
    }
  }(cst, document, fileTries, commentRanges);
}
