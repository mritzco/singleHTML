const fs = require("fs"),
  path = require("path"),
  main=require('main');

/** Parse the command line */
var args = process.argv.slice(2);

// Validate input
if (args.length !== 2) {
  console.log("Warning: Requires to arguments");
  console.log("node index.js [path/source.html] [targetfile]");
  process.exit();
}

const src = args[0];
const target = args[1];
const dirsrc = path.dirname(src);

if (!fs.existsSync(src)) {
  console.log("Error: Source file doesn't exist. Given: ", src);
  process.exit();
}

main({src, target, dirsrc});
