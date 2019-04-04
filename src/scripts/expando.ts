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
/* Take help json with wildcards and ranges in it and expand the wildcards out */
import * as fs from "fs";
if (process.argv.length < 3) {
  console.log("usage: ts-node expando.ts <filename.json>");
}
const helpList: string[][] = JSON.parse(
  fs.readFileSync(process.argv[2]).toString(),
);
// These are simple ranges
const rangeRegex = /_(\d+)-(\d+)/;
// These are wildcards that represent the axis names
const wildRegex = /_(\?)_/;
const axisNames = ["X", "Y", "Z", "A", "B", "C", "U", "V", "W"];
const expandedResults = [];
let captures;

/* Go through the list of items, which is an array of arrays.
   Each array should have 3 items, the name, the type,
   and the documentation */
for (const helpItem of helpList) {
  if ((captures = rangeRegex.exec(helpItem[0]))) {
    const lowerRange: number = parseInt(captures[1], 10);
    const upperRange: number = parseInt(captures[2], 10) + 1;
    for (let i = lowerRange; i !== upperRange; ++i) {
      const helpName = helpItem[0]
        // The capture string includes the _, so add one
        .substring(0, captures.index + 1)
        .concat(
          i.toString(),
          helpItem[0].substring(captures.index + captures[0].length),
        );
      expandedResults.push({
        name: helpName,
        kind: helpItem[1],
        documentation: helpItem[2],
      });
    }
  } else if ((captures = wildRegex.exec(helpItem[0]))) {
    for (const axisName of axisNames) {
      const helpName = helpItem[0]
        // The capture string includes the _, so add one
        .substring(0, captures.index + 1)
        .concat(
          axisName,
          // The capture string includes the terminating _, so subtract one
          helpItem[0].substring(captures.index - 1 + captures[0].length),
        );
      expandedResults.push({
        name: helpName,
        kind: helpItem[1],
        documentation: helpItem[2],
      });
    }
  } else {
    const helpNames = helpItem[0].split(/\s/);
    for (const helpName of helpNames) {
      expandedResults.push({
        name: helpName,
        kind: helpItem[1],
        documentation: helpItem[2],
      });
    }
  }
}
console.log(JSON.stringify(expandedResults, null, 2));
