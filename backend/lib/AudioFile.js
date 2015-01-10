function AudioFile(name,path,thumb,duration) {
  this.name = name;
  this.path = path;
  this.thumb = thumb;
  this.duration = duration;
  this.stream = false;
}

module.exports = AudioFile;
