var file = require('file');
var fs = require('fs');
var path = require('path');
var Folder = require('./Folder.js');
var AudioFile = require('./AudioFile.js');

/**
* Reads the local sources and holds them in a data structure
*/
function LocalSource(conf) {

  var that = this;
  this.conf = conf;
  this.rootFolder = new Folder(conf.name);

  this.loadSource = function() {
    console.log("Adding local dir: "+conf.name+" : "+conf.path)
    if (fs.existsSync(conf.path) == false) {
      throw new Error("Local dir: "+conf.name+" does not exist");
    }
    this.parseDirs();
  }

  this.parseDirs = function() {
    file.walkSync(conf.path, this.handleDir);
  }

  this.handleDir = function(dirPath, dirs, files) {

    if(dirs.length == 0 && files.length == 0) {
     console.log("Skipping empty dir: "+dirPath);
      return;
    }

    var relPath = dirPath.replace(that.conf.path,'');
    var pathParts = relPath.split(path.sep);
    var folderName = pathParts[pathParts.length-1];
    
    var folder = (folderName != '') ? new Folder(folderName) : that.rootFolder;
     if(files.length != 0) {
      for(idx in files) {
        var file = files[idx];
        if(path.extname(file) == ".mp3") {
          folder.addFile(new AudioFile(file,dirPath+path.sep+file));
        }
      }
    }

    if(folder.audioFiles.length == 0) {
      return;
    } 

    // check where to add the folder
    var parentFolder  = that.rootFolder;
    for(var idx = 0; idx < pathParts.length - 1; idx++) {

      var parentFolderName = pathParts[idx];
      if(parentFolderName == '') {
        continue;
      }
      if(parentFolder.subFolders[parentFolderName] === undefined) {
        parentFolder.addSubFolder(new Folder(parentFolderName));
      }
      parentFolder = parentFolder.subFolders[parentFolderName];
    }

    parentFolder.addSubFolder(folder);
  }

  that.loadSource();
}

module.exports = LocalSource;