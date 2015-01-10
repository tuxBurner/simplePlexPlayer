/**
 * This is a directory holding other directories and files to play
 * @param id
 * @param title
 * @param thumb
 * @param parent
 * @constructor
 */
var Directory = function(id, title, thumb,disableCaching, parent) {
  this.title = title;
  this.id = id;
  this.thumb = thumb;
  this.subDirs = [];
  this.files = [];
  this.parent = parent;
  this.disableCaching = disableCaching;
  this.initialized = false;


  /**
   * This is called to clean out the sub folders and files when caching is disabled on this folder
   */
  this.cleanSubs = function() {
    if(this.disableCaching == true) {
      this.subDirs = [];
      this.files = [];
    }
  }

  /**
   * Adds a subfolder to this folder
   * @param title
   * @param thumb
   * @param player
   */
  this.addSubDir = function(title, thumb,disableCaching, player) {
    var id = this.id + '/' + title
    var dir = new Directory(id, title, thumb,disableCaching, this.id);
    this.subDirs.push(dir);
    player.directories[id] = dir;
  }

  /**
   * Adds a file to this
   * @param audioFile
   * @param player
   */
  this.addFile = function(audioFile, player) {
    var readableDuration = Tools.readableDuration((audioFile.duration / 1000));
    var id = this.id + '/' + audioFile.name;
    var mp3Url = player.config.baseUrl + '/sources/' + id.split('?').join('%3F');

    var file = new AudioFile(id, audioFile.name, mp3Url, audioFile.thumb, readableDuration);

    this.files.push(file);
    player.files[id] = file;
  }
}
