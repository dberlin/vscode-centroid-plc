"use strict";
import * as vscode from "vscode";
import { BaseSymbolInfo } from "./vscode-centroid-common/BaseSymbolInfo";

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
export class SymbolInfo extends BaseSymbolInfo<SymbolType> {
  /* Which number symbol is it. All symbols of any type in centroid PLC are
  numbered instances of that type */
  symbolNumber: number;

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
    super(name, type, kind, doc, declType, "", value, declPos);

    this.symbolNumber = number;
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
