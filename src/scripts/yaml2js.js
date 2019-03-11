var js2yaml = require("js-yaml")
var fs = require("fs")
var fileData = js2yaml.safeLoad(fs.readFileSync(process.argv[2]).toString())
console.log(JSON.stringify(fileData, null, 2))
