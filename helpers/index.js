const fs = require('fs');
const path = require('path');

const appVer = require('../version.json').version;
exports.assetUrl = function (asset) {
  var url = '';
  switch (path.extname(asset)) {
    case '.js':
      url = `/js/`+path.basename(asset, '.js')+`_v${appVer}.min.js`;
      break;
    case '.css':
      url = `/css/`+path.basename(asset, '.css')+`_v${appVer}.min.css`;
      break;
    case '.png':
      url = `/images/`+path.basename(asset, '.png')+`_v${appVer}.png`;
      break;
    default:
      url = asset;
      break;
  }
  return url;
};