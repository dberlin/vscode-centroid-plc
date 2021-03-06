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

import { CommonTokenStream, Token } from "antlr4ts";
import * as vscode from "vscode";
import { CentroidPLCLexer } from "./CentroidPLCLexer";
import { CentroidPLCListener } from "./CentroidPLCListener";
import { DeclarationContext, StageContext } from "./CentroidPLCParser";
import { formatDocComment, isComment } from "./DocumentManager";
import { FileTries } from "./FileTries";
import { getSymbolTypeFromString, SymbolInfo, SymbolType } from "./SymbolInfo";
import { isSystemSymbolName } from "./util";
import { getSymbolByName } from "./vscode-util";

/* This class handles turning the parse tree into symbol info */
export class CentroidSymbolParseListener implements CentroidPLCListener {
  private document: vscode.TextDocument;
  private fileTries: FileTries;
  private tokens: CommonTokenStream;
  // Regex to split types into two pieces
  private variableTypeRegex = /((W|DW|FW|DFW|INP|JPI|MEM|OUT|JPO|STG|FSTG|T|PD|(?:SV_.*?))(\d+))/i;
  constructor(
    document: vscode.TextDocument,
    fileTries: FileTries,
    tokens: CommonTokenStream,
  ) {
    this.document = document;
    this.fileTries = fileTries;
    this.tokens = tokens;
  }

  public exitDeclaration(context: DeclarationContext) {
    let symbolDoc = "";
    // See where the expression stops and see if we have hidden tokens to the right of
    // it on the same line. This will be a comment if there is one.
    const stop = context.stop;
    if (stop) {
      const comments = this.tokens.getHiddenTokensToRight(stop.tokenIndex);
      // Find the first comment token on the same line
      if (comments.length !== 0) {
        const expressionStop = context.singleExpression().stop;
        for (const comment of comments) {
          // Stop when we hit a new line
          if (expressionStop && comment.line !== expressionStop.line) {
            break;
          }
          if (comment.type !== CentroidPLCLexer.Comment || !comment.text) {
            continue;
          }
          symbolDoc = comment.text;
          break;
        }
      }
    }

    const varName = context.variableName().text!;
    // Don't process system symbols here, we already have symbolinfo for them.
    if (isSystemSymbolName(varName)) {
      return;
    }

    // Format any comment we found.
    symbolDoc = isComment(symbolDoc) ? formatDocComment(symbolDoc) : "";

    // Get the type part of the declaration
    const typeText = context.singleExpression().text;
    let matches;
    const varNameToken = context.variableName().Identifier().symbol;

    // See if it's a type or something else
    if ((matches = this.variableTypeRegex.exec(typeText))) {
      this.processTypedSymbol(matches, varNameToken, typeText, symbolDoc);
    } else {
      this.processConstantSymbol(varNameToken, typeText, symbolDoc);
    }
  }

  //
  public exitStage(context: StageContext) {
    const ident = context.stageName();
    if (!ident) {
      return;
    }
    const symbol = this.fileTries.getSymbol(ident.text);
    if (!symbol) {
      return;
    }
    if (!context.stop) {
      return;
    }
    // Symbol def starts with name start, ends with end of last token
    symbol.symbolDefPos = context.start.startIndex;
    symbol.symbolDefEndPos = context.stop.stopIndex;
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
    varNameToken: Token,
    typeText: string,
    symbolDoc: string,
  ) {
    const varName = varNameToken.text!;
    // If this is a system variable type, it may be an alias for an existing
    // system symbol, in which case we will copy the documentation.
    if (isSystemSymbolName(typeText)) {
      const sym = getSymbolByName(this.document, typeText);
      if (sym) {
        const doc = sym.documentation as vscode.MarkdownString;
        if (doc === undefined) {
          return null;
        }
        const aliasSym = new SymbolInfo(
          varName,
          sym.symbolType,
          sym.detail,
          sym.symbolNumber,
          sym.symbolValue,
          "#### This is an alias for " + sym.label + "\n\n" + doc.value,
          varNameToken.startIndex,
        );
        this.fileTries.add(aliasSym);
        return;
      }
    }
    const symbolType = getSymbolTypeFromString(matches[2]);
    if (symbolType === undefined) {
      return;
    }
    const newSym = new SymbolInfo(
      varName,
      symbolType,
      typeText,
      parseInt(matches[3], 10),
      0,
      symbolDoc,
      varNameToken.startIndex,
    );
    this.fileTries.add(newSym);
  }
  /**
   * Given a symbol defined by a constant or math expression, process it.
   * @param varNameToken - Token representing the variable name
   * @param typeText - Text of the type
   * @param symbolDoc - Documentation comment that goes with the symbol
   */
  private processConstantSymbol(
    varNameToken: Token,
    typeText: string,
    symbolDoc: string,
  ) {
    const varName = varNameToken.text!;
    const sym = new SymbolInfo(
      varName,
      SymbolType.MessageOrConstant,
      typeText,
      0,
      parseInt(typeText, 10),
      symbolDoc,
      varNameToken.startIndex,
    );
    this.fileTries.add(sym);
  }
}
