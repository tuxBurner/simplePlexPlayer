/**
 * This is the Menuitem which represents a folder which can contain subFolders and audio files
 */
var SourceMenuItem = function(title) {
  this.title = title;
  this.id = title;
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

  // do nothing this is the main menu
  this.performBack = function() {
    return;
  }

}
SourceMenuItem.prototype = new MenuItem;
