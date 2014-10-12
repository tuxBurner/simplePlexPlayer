function AudioFile(name,path,thumb) {
  this.name = name;
  this.path = path;
  this.thumb = thumb;
  this.stream = false;
}

module.exports = AudioFile;
