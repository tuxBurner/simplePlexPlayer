var Directory = function(id,title,thumb,parent) {
  this.title = title;
  this.id = id;
  this.thumb = thumb;
  this.subDirs = [];
  this.files = [];
  this.parent = parent;
  this.initialized = false;

  this.addSubDir = function(title,thumb,player) {
    var id = this.id+'/'+title

    var dir = new Directory(id,title,thumb,this.id);
    this.subDirs.push(dir);
    player.directories[id] = dir;
  }

  this.addFile = function(audioFile,player) {
    var readableDuration = Tools.readableDuration((audioFile.duration / 1000));
    var id = this.id+'/'+audioFile.name;
    var mp3Url = player.config.baseUrl+'/sources/'+id.split('?').join('%3F');

    var file = new AudioFile(id,audioFile.name,mp3Url,audioFile.thumb,readableDuration);

    this.files.push(file);
    player.files[id] = file;
  }
}
