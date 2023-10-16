// lib/main.js
/**
 * Opens and process an HTML file
 * @type {Module}
 * @author Itzco
 * @version 1.0
 */
const fs = require("fs"),
  path = require("path"),
  async = require("async"),
  fileactions = require("./fileactions"),
  findFiles = require("./filetags"),
  processors = require("./processors");

function writeChunk(fileOut, chunk, matches, opts) {
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
    let incfile = fileactions.solvePath(opts.dirsrc, matches[loc].file);

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

function main(opts) {
  var file = fs.createReadStream(opts.src, "utf8");
  var fileOut = fs.createWriteStream(opts.target, "utf8");
  var matches = null;
  file.on("data", function(chunk) {
    file.pause();
    matches = findFiles.find(chunk);
    writeChunk(fileOut, chunk, matches, opts, err => {
      file.resume();
    });
  });

  file.on("end", function() {
    fileOut.close();
    console.log("[Done]");
  });
}

module.exports = main;
