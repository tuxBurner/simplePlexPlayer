/**
 * Describes a folder or a section from a source like local or plex
 */
function Folder(name, path, thumb) {

  var that = this;
  this.name = name;
  this.path = path;
  this.thumb = thumb;

  // marks if this folder was already initialized
  this.initialized = false;

  // when set to true the folder will be always initialized when requested
  this.disableCaching = false;

  // the callback function for getting the data for this folder
  this.dataCallBack = null

  this.subFolders = {};

  this.audioFiles = {};

  /**
   * This is called when the user wants to
   * @param httpRespCallback
   */
  this.loadSubData = function(httpRespCallback) {
    if (this.dataCallBack !== null && this.initialized == false) {
      if (this.disableCaching == true) {
        this.subFolders = {};
        this.audioFiles = {};
      } else {
        this.initialized = true;
      }
      this.dataCallBack(httpRespCallback);
      return;
    }
    httpRespCallback();
  }

  /**
   * Adds a subfolder to this folder
   */
  this.addSubFolder = function(folder) {
    that.subFolders[folder.name] = folder;
    if (that.thumb == '' && folder.thumb != '') {
      that.thumb = folder.thumb;
    }

    if (that.thumb != '' && folder.thumb == '') {
      folder.thumb = that.thumb;
    }
  }

  this.addFile = function(audioFile) {
    if (that.audioFiles[audioFile.name] !== undefined) {
      audioFile.name = that.findUniqueName(audioFile.name);
    }
    that.audioFiles[audioFile.name] = audioFile;
  }

  /**
   * tries to find a unique name when the one is already taken
   */
  this.findUniqueName = function(title) {
    var pref = 1;
    do {
      var newTitle = title + '_' + pref;
      if (that.audioFiles[newTitle] === undefined) {
        return newTitle;
      }
      pref++;
    } while (true);
  }

  /**
   * Overrride the to Json method we dont need all of the data
   */
  this.toJSON = function() {
    var subFolders = [];
    for (idx in this.subFolders) {
      subFolders.push({
        "name": idx,
        "thumb": this.subFolders[idx].thumb
      });
    }

    var audioFiles = [];
    for (idx in this.audioFiles) {
      audioFiles.push({
        "name": idx,
        "thumb": this.audioFiles[idx].thumb,
        "duration": this.audioFiles[idx].duration
      });
    }

    var json = {
      "subFolders": subFolders,
      "audioFiles": audioFiles,
      "disableCaching": this.disableCaching
    }
    return json;
  }
}

module.exports = Folder;
