
const rx = {
  favicon: /<link rel="shortcut icon"[^>]+>/g,
  manifest: /<link rel="manifest" href="([^"]*)"\/>/g,
  js: /<script src="([^"]+)"><\/script>/g,
  css: /<link href="([^"]*)"[^>]*>/g
};

function find(txt) {
  let tmp = {};
  Object.keys(rx).forEach(function(type) {
    while ((m = rx[type].exec(txt))) {
      if (m) {
        tmp[parseInt(m.index)] = { type, file: m[1], placeholder: m[0] };
      }
    }
  });
  return tmp;
}

module.exports = find;
