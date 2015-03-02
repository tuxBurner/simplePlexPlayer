var DirectoryMenuItem = function(title, thumb, parentId) {
  this.title = title;
  this.id = parentId + "/" + title;
  this.thumb = thumb;
  this.cssClass = "directory";

  this.displayContent = function() {
    MenuTools.displayMenuItem(this);
  }

  this.loadSubMenuItems = function(highlightId) {
    MenuTools.loadSourceEntrances(this, highlightId);
  }

  this.performAction = function() {
    this.loadSubMenuItems();
  }
}
DirectoryMenuItem.prototype = new MenuItem;
