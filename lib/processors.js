// lib/processors.js
/**
 * Functons to handle replacement and tagging of includes
 * @type {Module}
 * @author Itzco
 * @version 1.0
 */


const fileactions = require("fileactions"),
    filetags = require('filetags');
// Add removal
const _proc = {
  _do: (openStr, endStr, fileOut, incfile, cb) => {
    fileOut.write(openStr);
    fileactions.copyfile(incfile, fileOut, () => {
      fileOut.write(endStr);
      cb();
    });
  },
  _do_hooks: (openStr, endStr, hooks, fileOut, incfile, cb) =>{
    fileOut.write(openStr);
    fileactions.copyfile_hooks(incfile, fileOut, hooks, () => {
      fileOut.write(endStr);
      cb();
    });
  },
  _drop: (a, b, cb) => {
    cb();
  }
};

const processors = {
  init: _proc._drop,
  favicon: _proc._drop,
  manifest: _proc._drop,
  js: _proc._do_hooks.bind(this, '\n<script type="text/javascript">\n', "\n</script>\n", {
    ondata: filetags.cleanJS
  }),
  css: _proc._do_hooks.bind(this, "\n<style>\n", "\n</style>\n", {
    ondata: filetags.cleanCSS
  }),
};

module.exports = processors;
