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
import { SymbolInfo, SymbolType } from "./SymbolInfo";
import { BaseFileTries } from "./vscode-centroid-common/BaseFileTries";
import { Trie } from "tiny-trie";
import { isStageSymbol } from "./DocumentManager";

export class FileTries extends BaseFileTries {
  private constantSymbols: Trie = new Trie();
  private typedSymbols: Trie = new Trie();
  private stageSymbols: Trie = new Trie();
  private typeSymbols: Trie = new Trie();

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
    super.add(symbolInfo);
  }

  /**
   * Freeze all the tries so no more insertion can take place,
   * and convert them into DAWGs
   */
  freeze() {
    super.freeze();
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
    return stageNames.map(val => {
      return <SymbolInfo>this.getSymbol(val);
    });
  }
  getSymbol(label: string): SymbolInfo | null {
    return super.getSymbol(label) as SymbolInfo | null;
  }
}
