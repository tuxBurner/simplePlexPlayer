var Folder = require('./Folder.js');
var fs = require('fs');

/**
 * Reads the json config file for the stations
 */
function RadioSource(conf) {

  var that = this;
  this.conf = conf;
  this.rootFolder = new Folder(conf.name, conf.path);

  this.loadSource = function() {
    if (fs.existsSync(conf.path) == false) {
      throw new Error("Radio cfg file: " + conf.cfgFile + " does not exist");
    }

  }

  // initialze the radio stations
  that.loadSource();
}

module.exports = RadioSource;
