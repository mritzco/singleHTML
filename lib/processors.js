// lib/processors.js
/**
 * Functions to handle replacement and tagging of includes
 * @type {Module}
 * @author Itzco
 * @version 1.1
 */

const async = require("async");
const fileactions = require("./fileactions"),
  filetags = require('./filetags');
// Add removal
const _proc = {
  queue: [],
  // Files need to be processed on body close tag, add support for delayed processing
  add_queue: (openStr, endStr, hooks, fileOut, incfile, cb) => {
    _proc.queue.push({ openStr, endStr, hooks, incfile });
    cb();
  },
  // Do a normal file but registers a hook for onData - Writes as a stream with post-processing
  do_with_post_processing: (openStr, endStr, hooks, fileOut, incfile, cb) => {
    fileOut.write(openStr);
    fileactions.copyfile_hooks(incfile, fileOut, hooks, () => {
      fileOut.write(endStr);
      cb();
    });
  },
  // Takes the content and ignores it
  _drop: (a, b, cb) => {
    cb();
  },
  // Async loop, process all delayed files. This moves the file after </body>
  _do_delayed: function (openString, fileOut, incfile, final_callback) {
    // Full block openString
    fileOut.write(openString);
    // Process delayed files (array, (fn), final_callback)
    async.eachOfSeries(_proc.queue, (item, idx, callback) => {
      // Deconstruct delayed call
      const { openStr, endStr, hooks, incfile } = item;
      // Process the delayed item
      _proc.do_with_post_processing(openStr, endStr, hooks, fileOut, incfile, () => {
        // after do_with_post_processing, we continue async.loop
        callback();// Run next        
      });
    }, final_callback); // Here we make the final callback to continue with the file
  }
};

const processors = {
  init: _proc._drop,
  favicon: _proc._drop,
  manifest: _proc._drop,
  js: _proc.add_queue.bind(this, '\n<script type="text/javascript">\n', "\n</script>\n", {
    ondata: filetags.cleanJS
  }),
  css: _proc.add_queue.bind(this, "\n<style>\n", "\n</style>\n", {
    ondata: filetags.cleanCSS
  }),
  endbody: _proc._do_delayed.bind(this, '\n</body>\n')
};

module.exports = processors;
