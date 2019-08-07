// lib/filetags.js
/**
 * Regular expression to find tags in filetags and help functions
 * @type {Module}
 * @author Itzco
 * @version 1.0
 */

/**
 * Regular expressions to map file references
 * @type {Object}
 */
const rx = {
  favicon: /<link rel="shortcut icon"[^>]+>/g,
  manifest: /<link rel="manifest" href="([^"]*)"\/>/g,
  js: /<script src="([^"]+)"><\/script>/g,
  css: /<link href="([^"]*)"[^>]*>/g,
  mapjs: /\/\/#\s*sourceMappingURL=[a-z~.0-9]+(.chunk)?.js.map/g,
  mapcss: /\/\*#\s*sourceMappingURL=[a-z~.0-9]+(.chunk)?.css.map\s\*\//g,

};
/**
 * Finds all file references and create an object indexed by localization
 * @method find
 * @param  {string} txt The text to search instanceOf
 * @return {object}     Matches indexed by location
 */
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
/**
 * Function to clean maps, not parametrized to simplify _do_hooks
 * @method cleanMaps
 * @param  {string}  text source textTransform
 * @return {string}       string without maps
 */
function cleanJS(text) {
    return text.replace(rx.mapjs, '')
}
function cleanCSS(text) {
    return text.replace(rx.mapcss, '')
}
module.exports = {find, rx, cleanJS, cleanCSS};
