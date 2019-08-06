const fs = require("fs"),
  path = require("path"),
  async = require("async");
const fileactions = require("fileactions"),
 findFiles = require('filetags')

const processors = require("lib/processors");
// console.log("[processors]", processors);

/** Parse the command line */
var args = process.argv.slice(2);

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

main(src, target);


function writeChunk(fileOut, chunk, matches) {
    // add one for the first section before matches
  matches["0"] = { type: "init", file: "", placeholder: "" };
  let replace_locs = Object.keys(matches).sort(
    (a, b) => parseInt(b) < parseInt(a)
  );
  async.eachOfSeries(replace_locs, (key, idx, callback) => {
    // console.log('-------------------------------------');
    let loc = parseInt(key);
    let item = matches[loc];
    let from = loc + item.placeholder.length;
    let to =
      idx + 1 === replace_locs.length ? chunk.length : replace_locs[idx + 1];
    // Process the section

    let incfile = fileactions.solvePath(dirsrc, matches[loc].file);

    processors[matches[loc].type](fileOut, incfile, () => {
      // Write the segment
      if (to > from) {
        fileOut.write(chunk.substring(from, to));
        callback();
      } else {
        callback();
      }
    });
  });
}

function main(src, target) {
  var file = fs.createReadStream(src, "utf8");
  var fileOut = fs.createWriteStream(target, "utf8");
  // var fileOut = { write: (msg) => {console.log('[fileOut.write]', msg);}}
  var matches = null;
  file.on("data", function(chunk) {
    file.pause();
    matches = findFiles(chunk);
    writeChunk(fileOut, chunk, matches, err => {
      file.resume();
    });
  });

  file.on("end", function() {
    fileOut.close();
    console.log("[Done]");
  });
}
