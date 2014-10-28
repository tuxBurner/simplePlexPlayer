var fs = require('fs');
var mm = require('musicmetadata');
var path = require('path');
var Folder = require('./Folder.js');
var AudioFile = require('./AudioFile.js');

/**
* Reads the local sources and holds them in a data structure
*/
function LocalSource(conf) {

  var that = this;
  this.conf = conf;
  this.rootFolder = new Folder(conf.name,conf.path);

  this.loadSource = function() {
    console.log("Adding local dir: "+conf.name+" : "+conf.path)
    if (fs.existsSync(conf.path) == false) {
      throw new Error("Local dir: "+conf.name+" does not exist");
    }
    this.handleDir(that.rootFolder);
  }


  /**
  * reads a directory and adds the subfolders and mp3s
  */
  this.handleDir = function(parentFolder,callBack) {

    var parentPath = parentFolder.path;

    var dirContent = fs.readdirSync(parentPath);

    for(idx in dirContent) {
      var dirContentName = dirContent[idx];
      var absolutePath = parentPath+path.sep+dirContent[idx];
      // check what type it is
      var isDir = fs.lstatSync(absolutePath).isDirectory()

      if(isDir == true) {
        var subFolder = new Folder(dirContentName, absolutePath);

        // register callback when the user requests this folder
        subFolder.dataCallBack = function(httpRespCallback) {
          that.handleDir(this,httpRespCallback)
        }
        parentFolder.addSubFolder(subFolder);
      } else {
         // check if we have a mp3
         if(path.extname(dirContentName) != ".mp3") {
           continue;
         }

         parentFolder.addFile(new AudioFile(dirContentName,absolutePath));
         /*var stream = fs.createReadStream(absolutePath)
         var parser = mm(stream, { duration: true });
         parser.on('duration', function (result) {
            console.log(result);
          });
          parser.on('done', function (err) {
            stream.destroy();
        });*/
      }
    }

    if(callBack !== undefined) {
      callBack();
    }
  }

  that.loadSource();
}

module.exports = LocalSource;
