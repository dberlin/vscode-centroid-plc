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
  SystemVariable
}
export class SymbolInfo extends vscode.CompletionItem {
  /* Which number symbol is it. All symbols of any type in centroid PLC are numbered instances of that type */
  symbolNumber: number;
  /* If this is a constant symbol, what is the value. */
  symbolValue: number;
  /* What kind of symbol is it. */
  symbolType: SymbolType;
  /* What offset in the file did the symbol appear at. */
  symbolPos: number;

  constructor(
    name: string,
    type: SymbolType,
    declType: string = "",
    number: number = 0,
    value: number = 0,
    doc: string = "",
    pos: number = 0
  ) {
    super(name, vscode.CompletionItemKind.Variable);
    this.documentation = doc;
    this.detail = declType;
    this.symbolNumber = number;
    this.symbolType = type;
    this.symbolValue = value;
    this.symbolPos = pos;
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
