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
    this.handleDir(conf.path);
  }



  this.handleDir = function(parentPath,callBack) {

    console.error(parentPath);

    var dirContent = fs.readdirSync(parentPath);

    var parentIsRootFolder = (parentPath == that.conf.path);

    var folder = (parentIsRootFolder == false) ? new Folder(folderName) : that.rootFolder;

    for(idx in dirContent) {
      var dirContentName = dirContent[idx];
      var absolutePath = parentPath+path.sep+dirContent[idx];
      // check what type it is
      var isDir = fs.lstatSync(absolutePath).isDirectory()

      if(isDir == true) {
        var subFolder = new Folder(dirContentName, absolutePath);
        // register callback when the user requests this folder
        subFolder.dataCallBack = function(httpRespCallback) {
          that.handleDir(absolutePath,httpRespCallback)
        }
        folder.addSubFolder(subFolder);
      } else {
         // check if we have a mp3
         if(path.extname(dirContentName) != ".mp3") {
           continue;
         }

         folder.addFile(new AudioFile(dirContentName,absolutePath));

         /*var stream = fs.createReadStream(absolutePath)
         var parser = mm(stream, { duration: true });
         parser.on('duration', function (result) {
            console.log(result);
          });
          parser.on('done', function (err) {
            stream.destroy();
        });*/
      }
      if(callBack !== undefined) {
        callBack();
      }
    }

    //fs.lstatSync(path_string).isDirectory()

    /*if(dirs.length == 0 && files.length == 0) {
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
          var absolutePath = dirPath+path.sep+file;
          var parser = mm(fs.createReadStream(absolutePath), { duration: true });
          parser.on('duration', function (result) {
            console.log(result);
          });
          parser.on('done', function (err) {
            folder.addFile(new AudioFile(file,absolutePath));
            stream.destroy();
          });
        }
      }
    }

    //
    if(Object.keys(folder.audioFiles).length == 0) {
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

    // dont add the parent folder itself
    if(folderName != '') {
      parentFolder.addSubFolder(folder);
    }*/
  }

  that.loadSource();
}

module.exports = LocalSource;
