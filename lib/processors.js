const fileactions =  require ('fileactions');
// Add removal
const _proc = {
  _do: (open, close, fo, incfile, cb) => {
    fo.write(open);
    fileactions.copyfile(incfile, fo, () => {
      fo.write(close);
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
  manifest: _proc._do.bind(this, "<manifest>", "</manifest>"),
  js: _proc._do.bind(this, '<script type="javascript">', "</script>"),
  css: _proc._do.bind(this, "<style>", "</style>")
};

module.exports =  processors
