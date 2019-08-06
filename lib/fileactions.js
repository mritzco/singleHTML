const fs = require("fs"),
  path = require("path");

function solvePath(basepath, relfile) {
  return path.resolve(basepath, "." + relfile);
}
function copyfile(filename, fileOut, callback) {
  let stream = fs.createReadStream(filename, { encoding: "utf8" });
  stream.on("data", function(chunk) {
    fileOut.write(chunk);
  });
  stream.on("end", function() {
    callback(null);
  });
}
module.exports = { copyfile, solvePath };
