var Directory = function(id,title,thumb,parent) {
  this.title = title;
  this.id = id;
  this.thumb = thumb;
  this.subDirs = [];
  this.files = [];
  this.parent = parent;
  this.initialized = false;

  this.addSubDir = function(id,title,thumb,player) {
    if(thumb !== undefined) {
      thumb = player.config.baseUrl+thumb;
    } else {
      thumb = this.thumb;
    }
    var dir = new Directory(id,title,thumb,this.id);
    this.subDirs.push(dir);
    player.directories[id] = dir;
  }

  this.addFile = function(fileXml,player) {
    var mediaXml = $(fileXml).find("Media");
    var partXml = $(fileXml).find("Part");

    var duration = $(mediaXml).attr('duration');
    var title = $(fileXml).attr('title');
    var id = $(partXml).attr('id');
    var mp3Url = player.config.baseUrl+"/library/parts/"+id+"/file.mp3";

    var readableDuration = Tools.readableDuration((duration / 1000));
    var file = new File(id,title,mp3Url,this.thumb,readableDuration);

    this.files.push(file);
    player.files[id] = file;
  }
}
