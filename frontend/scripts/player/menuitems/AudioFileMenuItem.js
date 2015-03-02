var AudioFileMenuItem = function(audioFile, parentId) {
  this.title = audioFile.name;
  this.id = parentId + "/" + audioFile.name;
  this.thumb = audioFile.thumb;
  this.cssClass = "file";
  this.audioFile = audioFile;

  this.displayContent = function() {
    MenuTools.displayMenuItem(this);
  }

  // noop
  this.loadSubMenuItems = function(highlightId) {
    return;
  }

  this.performAction = function() {
    var menuItems = [];
    menuItems.push(new PlayerMenuItem(audioFile, this.id));
    MenuHandler.setCurrentItems(menuItems, this);
  }
}
AudioFileMenuItem.prototype = new MenuItem;
