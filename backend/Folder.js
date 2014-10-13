/**
* Describes a folder or a section from a source like local or plex
*/
function Folder(name,path,thumb) {

  var that = this;
  this.name = name;
  this.path = path;
  this.thumb = thumb;

  this.subFolders = {};

  this.audioFiles = {};


  this.addSubFolder = function(folder){
    that.subFolders[folder.name] = folder;
    if(that.thumb == '' && folder.thumb != '') {
      that.thumb = folder.thumb;
    }

    if(that.thumb != '' && folder.thumb == '') {
      folder.thumb = that.thumb;
    }
  }

  this.addFile = function(audioFile) {
    that.audioFiles[audioFile.name] = audioFile;
  }

  this.toJSON = function() {

    var subFolders = [];
    for(idx  in this.subFolders) {
      subFolders.push({ "name" : idx, "thumb" : this.subFolders[idx].thumb });
    }

    var audioFiles = [];
    for(idx  in this.audioFiles) {
      audioFiles.push({ "name" : idx, "thumb" : this.audioFiles[idx].thumb, "duration" : this.audioFiles[idx].duration });
    }

    var json = {
      "subFolders" : subFolders,//Object.keys(this.subFolders),
      "audioFiles" : audioFiles
    }
    return json;
  }
}

module.exports = Folder;
