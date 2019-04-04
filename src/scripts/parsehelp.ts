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
// Parse system variable help out of language.msg files

import * as fs from "fs";
function replaceAll(str: string, find: string, rep: string) {
  while (true) {
    const beforeLength = str.length;
    str = str.replace(find, rep);
    if (str.length === beforeLength) {
      break;
    }
  }
  return str;
}
if (process.argv.length < 3) {
  console.log("usage: ts-node parsehelp.ts <language.msg file>");
  process.exit(0);
}
const parameterRegexp = /P(\d+)_LABEL =(.*?)spa:/gms;
const textTokens = fs.readFileSync(process.argv[2]).toString();
const symbols = [];
let captures: RegExpExecArray | null;
while ((captures = parameterRegexp.exec(textTokens))) {
  if (captures[2].search("Not Used") !== -1) {
    continue;
  }
  let docTemp: string = replaceAll(captures[2], '\\n"', "");
  docTemp = replaceAll(docTemp, "+\r\n", "\n");
  docTemp = replaceAll(docTemp, '"', "");
  docTemp = replaceAll(docTemp, "\r\n", "\n");
  docTemp = docTemp.trim();

  const docTempArray: string[] = docTemp.split("\n");
  docTempArray[0] = "### " + docTempArray[0];
  if (docTempArray.length > 1) {
    docTempArray.forEach((val, index, arr) => {
      arr[index] = val.trim().concat("  ");
    });
  }
  symbols.push({
    name: "SV_MACHINE_PARAMETER_".concat(captures[1]),
    kind: "system-variable",
    documentation: docTempArray.join("\n"),
  });
}
console.log(JSON.stringify(symbols, null, 2));
