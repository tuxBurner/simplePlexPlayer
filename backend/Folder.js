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
  }

  this.addFile = function(audioFile) {
    that.audioFiles[audioFile.name] = audioFile;
  }

  this.toJSON = function() {
    var json = {
      "subFolders" : Object.keys(this.subFolders),
      "audioFiles" : Object.keys(this.audioFiles)
    }
    return json;
  }
}

module.exports = Folder;
