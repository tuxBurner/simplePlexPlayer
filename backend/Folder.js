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
    if(that.thumb != '' && folder.thumb != '') {
      that.thumb = folder.thumb;
    }
  }

  this.addFile = function(audioFile) {
    that.audioFiles[audioFile.name] = audioFile;
  }

  this.toJSON = function() {
    var json = {
      "subFolders" : Object.keys(this.subFolders),
      "audioFiles" : this.audioFiles
    }
    return json;
  }
}

module.exports = Folder;
