import * as fs from "fs";
if (process.argv.length < 3) {
  console.log("usage: ts-node expando.ts <filename.json>");
}
let helpList: string[][] = JSON.parse(
  fs.readFileSync(process.argv[2]).toString()
);
let rangeRegex = new RegExp("_([0-9]+)-([0-9]+)", "g");
let expandedResults = [];
let captures;

for (var helpItem of helpList) {
  if ((captures = rangeRegex.exec(helpItem[0]))) {
    let lowerRange: number = parseInt(captures[1]);
    let upperRange: number = parseInt(captures[2]) + 1;
    for (var i = lowerRange; i != upperRange; ++i) {
      let helpName = helpItem[0]
        .substring(0, captures.index + 1)
        .concat(
          i.toString(),
          helpItem[0].substring(captures.index + captures[0].length)
        );
      expandedResults.push({
        name: helpName,
        kind: helpItem[1],
        documentation: helpItem[2]
      });
    }
  } else {
    let helpNames = helpItem[0].split(new RegExp("\\s"));
    for (var helpName of helpNames) {
      expandedResults.push({
        name: helpName,
        kind: helpItem[1],
        documentation: helpItem[2]
      });
    }
  }
}
console.log(JSON.stringify(expandedResults, null, 2));
