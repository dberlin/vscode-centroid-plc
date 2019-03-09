if (process.argv.length < 3) {
    console.log('usage: node tokenstotrie.js <file with tokens>');
    process.exit(0);
}
var Trie = require("tiny-trie");
var fs = require("fs");
var textTokens = fs.readFileSync(process.argv[2]).toString().split(/[\r\n]+/);
var tokenTrie = new Trie.Trie();
textTokens.forEach(function(element) { tokenTrie.insert(element);});
tokenTrie.freeze();
console.log(tokenTrie.encode());
