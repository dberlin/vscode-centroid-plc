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
import {
  ANTLRInputStream,
  BailErrorStrategy,
  CommonTokenStream
} from "antlr4ts";
import { PredictionMode } from "antlr4ts/atn/PredictionMode";
import { CentroidPLCLexer } from "./CentroidPLCLexer";
import { CentroidPLCParser } from "./CentroidPLCParser";

/**
 *
 * This function normalizes symbol names.
 *
 * @param name - symbol name to normalize.
 */
export function normalizeSymbolName(name: string) {
  return name.trim();
}

interface symbolWithLabel {
  label: string;
}
/**
 * Return true if the passed in symbol is a system defined symbol
 *
 * @param sym - Symbol to check
 */
export function isSystemSymbol(sym: symbolWithLabel) {
  return isSystemSymbolName(sym.label);
}

export function isSystemSymbolName(symName: string) {
  return symName.toUpperCase().startsWith("SV_");
}

/**
 * Return a regular expression that matches any of the input regular expressions
 * @param args - Regular expressions to combine
 */
export function RegExpAny(...args: RegExp[]) {
  let components: string[] = [];
  let flags = new Map();
  for (let i = 0; i < args.length; i++) {
    components.push(args[i].source);
    for (let flag of args[i].flags.split("")) {
      flags.set(flag, flag);
    }
  }
  let newFlags = [];
  for (let key of flags.keys()) {
    newFlags.push(key);
  }
  let combined = new RegExp(
    `(?:${components.join(")|(?:")})`,
    newFlags.join("")
  );
  return combined;
}

/**
 * Collect the text of all child nodes and return it as a string
 * @param ctx - Node to start from
 */
export function collectTextOfChildren(ctx: any) {
  let stringResult = "";
  if (ctx.image) stringResult = ctx.image;
  if (ctx.children) {
    for (let child of Object.values(ctx.children)) {
      if (Array.isArray(child)) {
        for (let entry of child) {
          let tempResult = collectTextOfChildren(entry);
          if (tempResult) stringResult += tempResult;
        }
      } else {
        let tempResult = collectTextOfChildren(child);
        if (tempResult) stringResult += tempResult;
      }
    }
  }
  return stringResult;
}

export function createPLCLexerForText(text: string) {
  const inputStream = new ANTLRInputStream(text);
  return new CentroidPLCLexer(inputStream);
}
export function createPLCParserForLexer(lexer: CentroidPLCLexer) {
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CentroidPLCParser(tokenStream);
  parser.interpreter.setPredictionMode(PredictionMode.SLL);
  return parser;
}
export function createPLCParserForText(text: string) {
  const lexer = createPLCLexerForText(text);
  return createPLCParserForLexer(lexer);
}
