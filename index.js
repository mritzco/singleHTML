const fs = require("fs"),
  path = require("path"),
  async = require("async");

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

replaceRefs(src, target);
/** uses global**/
function solvePath(filename) {
  return path.resolve(dirsrc, "." + filename);
}
function copyfile(filename, fileOut, callback) {
  let fin_path = solvePath(filename);
  let stream = fs.createReadStream(fin_path, { encoding: "utf8" });
  stream.on("data", function(chunk) {
      console.log('  [copyfile.write]');
    fileOut.write(chunk);
  });
  stream.on("end", function() {
      console.log('[copyfile.end]');
    callback(null);
  });
}
var _proc = {
  _do: (open, close, fo, seg, cb) => {
    console.log("[_proc.%s]", open);
    fo.write(open);
    console.log('[_proc.start.copyfile]', seg.file);
    copyfile(seg.file, fo, () => {
      console.log("[%s] File written!", close);
      fo.write(close);
      cb();
    });
  },
  _drop: (a, b, cb) => {
    cb();
  }
};
var processors = {
  init: _proc._drop,
  favicon: _proc._drop,
  manifest: _proc._do.bind(this, "<manifest>", "</manifest>"),
  js: _proc._do.bind(this, "<script>", "</script>"),
  css: _proc._do.bind(this, "<style>", "</style>")
};
console.log("[processors]", processors);
const rx = {
  favicon: /<link rel="shortcut icon"[^>]+>/g,
  manifest: /<link rel="manifest" href="([^"]*)"\/>/g,
  js: /<script src="([^"]+)"><\/script>/g,
  css: /<link href="([^"]*)"[^>]*>/g
};

function findFiles(txt) {
  let tmp = {};
  Object.keys(rx).forEach(function(type) {
    while ((m = rx[type].exec(txt))) {
      if (m) {
        tmp[parseInt(m.index)] = { type, file: m[1], placeholder: m[0] };
      }
    }
  });
  console.log("matches", tmp);
  return tmp;
}
function writeChunk(fileOut, chunk, matches) {
  matches["0"] = { type: "init", file: "", placeholder: "" };
  let replace_locs = Object.keys(matches).sort(
    (a, b) => parseInt(b) < parseInt(a)
  );
  
  async.eachSeries(replace_locs, (key,  callback) => {
     console.log('-------------------------------------');
     console.log("[async]", key);
    let loc = parseInt(key);
    let item = matches[loc];
    let from = loc + item.placeholder.length;
    let to =
      key + 1 === replace_locs.length ? chunk.length : replace_locs[key + 1];
      console.log("[async]", from);
    // // Process the section
    // console.log("[Starting.%s]", matches[loc].type);
    //
    // processors[matches[loc].type](fileOut, matches[loc], () => {
    //   console.log("[proc.%s] Done ", matches[loc].type);
    //   // Write the segment
    //   if (to > from) {
    //       console.log('[writeChunk.endChunk]');
    //     fileOut.write(chunk.substring(from, to));
        callback();
      // } else {
      //   // callback();
      // }
    // });
});


}

function replaceRefs(src, target) {
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
