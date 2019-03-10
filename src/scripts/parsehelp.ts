// Parse system variable help out of language.msg files

import * as fs from "fs";
function replaceAll(str: string, find: string, rep: string) {
  while (true) {
    let beforeLength = str.length;
    str = str.replace(find, rep);
    if (str.length == beforeLength) break;
  }
  return str;
}
if (process.argv.length < 3) {
  console.log("usage: ts-node parsehelp.ts <language.msg file>");
  process.exit(0);
}
let parameterRegexp = new RegExp("P([0-9]+)_LABEL =(.*?)spa:", "gsm");
let textTokens = fs.readFileSync(process.argv[2]).toString();
let symbols = [];
let captures: RegExpExecArray | null;
while ((captures = parameterRegexp.exec(textTokens))) {
  if (captures[2].search("Not Used") != -1) continue;
  let docTemp: string = replaceAll(captures[2], '\\n"', "");
  docTemp = replaceAll(docTemp, "+\r\n", "\n");
  docTemp = replaceAll(docTemp, '"', "");
  docTemp = replaceAll(docTemp, "\r\n", "\n");
  docTemp = docTemp.trim();

  let docTempArray: string[] = docTemp.split("\n");
  docTempArray[0] = "### " + docTempArray[0];
  if (docTempArray.length > 1) {
    docTempArray.forEach((val, index, arr) => {
      arr[index] = val.trim().concat("  ");
    });
  }
  symbols.push({
    name: "SV_MACHINE_PARAMETER_".concat(captures[1]),
    kind: "system-variable",
    documentation: docTempArray.join("\n")
  });
}
console.log(JSON.stringify(symbols, null, 2));
