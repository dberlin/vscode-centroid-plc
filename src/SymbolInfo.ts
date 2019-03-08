"use strict";
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
export class SymbolInfo {
  /* Name of the symbol */
  symbolName: string;
  /* Which number symbol is it. All symbols of any type in centroid PLC are numbered instances of that type */
  symbolNumber: number;
  /* If this is a constant symbol, what is the value. */
  symbolValue: number;
  /* What kind of symbol is it. */
  symbolType: SymbolType;
  /* What comments/documentation came with the symbol. */
  symbolDoc: string;
  /* What line number did the symbol appear on. */
  symbolLine: number;
  /* What was the original declaration type of the symbol. */
  symbolDeclType: string;

  constructor(
    name: string,
    type: SymbolType,
    declType: string = "",
    number: number = 0,
    value: number = 0,
    doc: string = ""
  ) {
    this.symbolName = name;
    this.symbolNumber = number;
    this.symbolDeclType = declType;
    this.symbolType = type;
    this.symbolDoc = doc;
    this.symbolValue = value;
    this.symbolLine = 0;
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
