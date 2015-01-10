var Folder = require('./../Folder.js');
var AudioFile = require('./../AudioFile.js');
var fs = require('fs');

/**
 * Reads the json config file for the stations
 */
function RadioSource(conf) {

  var that = this;
  this.conf = conf;
  this.rootFolder = new Folder(conf.name, conf.path);

  this.loadSource = function() {
    if (fs.existsSync(conf.cfgFile) == false) {
      throw new Error("Radio cfg file: " + conf.cfgFile + " does not exist");
    }

    var stationsCfg = require('../../'+conf.cfgFile);

    for (idx in stationsCfg) {
      var station = stationsCfg[idx];
      var file = new AudioFile(station.name, station.url, station.thumb,
        null);
      file.stream = true;
      this.rootFolder.addFile(file);
    }
  }

  // initialze the radio stations
  that.loadSource();
}

module.exports = RadioSource;
