// lib/fileactions.js
/**
 * Basic functions to resolve libraries on a create-react-app build and copy streams
 * @type {Module}
 * @author Itzco
 * @version 1.0
 */

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
function copyfile_hooks(filename, fileOut, hooks, callback) {
  let stream = fs.createReadStream(filename, { encoding: "utf8" });
  stream.on("data", function(chunk) {
    fileOut.write(hooks.ondata(chunk));
  });
  stream.on("end", function() {
    callback(null);
  });
}
module.exports = { copyfile, solvePath, copyfile_hooks };
