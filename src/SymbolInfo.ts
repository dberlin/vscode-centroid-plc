"use strict";
import * as vscode from "vscode";

export enum SymbolType {
  Word,
  DoubleWord,
  Float,
  DoubleFloat,
  Input,
  Memory,
  Output,
  Stage,
  FastStage,
  Timer,
  OneShot,
  MessageOrConstant,
  BuiltInKeyword
}
export class SymbolInfo extends vscode.CompletionItem {
  /* Which number symbol is it. All symbols of any type in centroid PLC are numbered instances of that type */
  symbolNumber: number;
  /* If this is a constant symbol, what is the value. */
  symbolValue: number;
  /* What kind of symbol is it. */
  symbolType: SymbolType;
  /* What offset in the file did the symbol get declared at. */
  symbolDeclPos: number;
  /* What offset in the file did the symbol get defined at. */
  symbolDefPos: number;
  /* What offset in the file did the symbol end at (for stages). */
  symbolDefEndPos: number;

  constructor(
    name: string,
    type: SymbolType,
    declType: string = "",
    number: number = 0,
    value: number = 0,
    doc: string = "",
    declPos: number = -1
  ) {
    let kind = vscode.CompletionItemKind.Variable;
    if (type == SymbolType.MessageOrConstant) {
      kind = vscode.CompletionItemKind.Value;
    } else if (type == SymbolType.BuiltInKeyword) {
      kind = vscode.CompletionItemKind.Function;
    }
    super(name, kind);
    this.documentation = new vscode.MarkdownString(doc);
    this.detail = declType;
    this.symbolNumber = number;
    this.symbolType = type;
    this.symbolValue = value;
    this.symbolDeclPos = declPos;
    this.symbolDefPos = -1;
    this.symbolDefEndPos = -1;
  }
}
const SymbolStringFromType: Map<SymbolType, string> = new Map([
  [SymbolType.Word, "W"],
  [SymbolType.DoubleWord, "DW"],
  [SymbolType.Float, "FW"],
  [SymbolType.DoubleFloat, "DFW"],
  [SymbolType.Input, "INP"],
  [SymbolType.Memory, "MEM"],
  [SymbolType.Output, "OUT"],
  [SymbolType.Output, "JPO"],
  [SymbolType.Stage, "STG"],
  [SymbolType.FastStage, "FSTG"],
  [SymbolType.Timer, "T"],
  [SymbolType.OneShot, "PD"]
]);
export function getSymbolStringFromType(type: SymbolType) {
  return SymbolStringFromType.get(type);
}
const SymbolTypeFromString: Map<string, SymbolType> = new Map([
  ["W", SymbolType.Word],
  ["DW", SymbolType.DoubleWord],
  ["FW", SymbolType.Float],
  ["DFW", SymbolType.DoubleFloat],
  ["INP", SymbolType.Input],
  ["MEM", SymbolType.Memory],
  ["OUT", SymbolType.Output],
  ["JPO", SymbolType.Output],
  ["STG", SymbolType.Stage],
  ["FSTG", SymbolType.FastStage],
  ["T", SymbolType.Timer],
  ["PD", SymbolType.OneShot]
]);
export function getSymbolTypeFromString(str: string) {
  return SymbolTypeFromString.get(str);
}
