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

  this.initDirectoryMenu = function(dir) {

    var menuItems = [];
    for(idx in dir.subDirs) {
      var subDir = dir.subDirs[idx];
      menuItems.push(new MenuItem(subDir,"directory",dir.id));
    }
    if(dir.files.length > 1) {
      menuItems.push(new MenuItem({"title" : "Play All", "id" : dir.id, "thumb" : dir.thumb},"playall"));
    }
    for(idx in dir.files) {
      var file = dir.files[idx];
      menuItems.push(new MenuItem(file,"file",dir.id));
    }

    this.currentMenuItems = menuItems;
  }




  this.getCurrentMenuItem = function() {
    return this.currentMenuItems[this.currentMenuIdx];
  }

  this.removeLastMenuItemFromStack = function() {
    if(this.menuStack.length == 0) {
      return null;
    }
    var removedMenuItem = this.menuStack.pop();
    this.menuStackToUrlHash();

    return removedMenuItem;
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

  this.setMenuIdxByMenuItem = function(highlightMenuItem) {
    for(idx in this.currentMenuItems) {
      if(this.currentMenuItems[idx].id == highlightMenuItem) {
        this.currentMenuIdx = new Number(idx);
        break;
      }
    }
  }

  this.nextMenuItem = function(nextItem) {
    if(this.currentMenuItems.length <= 1) {
      return false;
    }

    if(nextItem == true) {
      this.currentMenuIdx++;
      if(this.currentMenuIdx == this.currentMenuItems.length) {
        this.currentMenuIdx = 0;
      }
    } else {
      this.currentMenuIdx--;
      if(this.currentMenuIdx < 0) {
        this.currentMenuIdx = this.currentMenuItems.length-1;
      }
    }

    return true;
  }


}
