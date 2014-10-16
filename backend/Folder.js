/**
* Describes a folder or a section from a source like local or plex
*/
function Folder(name,path,thumb) {

  var that = this;
  this.name = name;
  this.path = path;
  this.thumb = thumb;

  // marks if this folder was already initialized
  this.initialized = false;

  // the callback function for getting the data for this folder
  this.dataCallBack = null

  this.subFolders = {};

  this.audioFiles = {};


  this.loadSubData = function(httpRespCallback) {
    if(this.dataCallBack !== null && this.initialized == false) {
      this.initialized = true;
      this.dataCallBack(httpRespCallback);         
      return;
    }


    httpRespCallback();
  }

  /**
  * Adds a subfolder to this folder
  */
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

  /**
  * Overrride the to Json method we dont need all of the data
  */
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
