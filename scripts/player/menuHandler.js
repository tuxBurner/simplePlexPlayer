var MenuHandler = function() {
  this.currentMenuItems = [];
  this.currentMenuIdx = 0;
  this.menuStack = [];

  this.initMainMenu = function(sections) {
    this.currentMenuItems = [];
    for(idx in sections) {
      var section = sections[idx];
      this.currentMenuItems.push(new MenuItem(section,"section",-1));
    }
  }

  this.getCurrentMenuItem = function() {
    return this.currentMenuItems[this.currentMenuIdx];
  }

  this.addMenuItemToStack = function(menuItem) {
    this.menuStack.push(menuItem);
    this.menuStackToUrlHash();
  }

  this.menuStackToUrlHash = function() {
    var hash = "";
    if(this.menuStack.length > 0) {
      var sep = "";
      for(idx in this.menuStack) {
        hash+=sep+this.menuStack[idx].id;
        sep = ",";
      }
    }
    window.location.hash = hash;
  }
}
