var MenuHandler = function() {
  this.currentMenuItems = [];
  this.currentMenuIdx = 0;
  this.menuStack = [];

  this.initMainMenu = function(sections) {
    this.currentMenuItems = [];
    for (idx in sections) {
      var section = sections[idx];
      this.currentMenuItems.push(new MenuItem(section, "section", -1));
    }

    this.currentMenuItems.push(new MenuItem({
      "title": "Optionen",
      "id": "opts_main"
    }, "options", -1));
  }


  /**
   * Initializes a directory menu page
   */
  this.initDirectoryMenu = function(dir) {
    var menuItems = [];
    for (idx in dir.subDirs) {
      var subDir = dir.subDirs[idx];
      menuItems.push(new MenuItem(subDir, "directory", dir.id));
    }
    if (dir.files.length > 1) {
      menuItems.push(new MenuItem({
        "title": "Play All",
        "id": dir.id,
        "thumb": dir.thumb
      }, "playall"));
    }
    for (idx in dir.files) {
      var file = dir.files[idx];
      menuItems.push(new MenuItem(file, "file", dir.id));
    }

    this.currentMenuItems = menuItems;
  }


  /**
   * Initializes the option menu
   */
  this.initOptionMenu = function() {
    var optionMenuItems = []
    optionMenuItems.push(new MenuItem({
      "title": "Sys Infos",
      "id": "opts_sysInfos",
      "displayCallBack": function(player) {
        player.optionsHandler.displaySysInfos();
        //new OptionsHandler().displaySysInfos();
        //alert("test123");
      }
    }, "options", "opts_main"));

    optionMenuItems.push(new MenuItem({
      "title": "Wifi Settings",
      "id": "opts_wifisettings"
    }, "options", "opts_main"));

    this.currentMenuItems = optionMenuItems;
  }


  this.getCurrentMenuItem = function() {
    return this.currentMenuItems[this.currentMenuIdx];
  }

  this.removeLastMenuItemFromStack = function() {
    if (this.menuStack.length == 0) {
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
    if (this.menuStack.length > 0) {
      var sep = "";
      for (idx in this.menuStack) {
        hash += sep + this.menuStack[idx].id;
        sep = ",";
      }
    }
    //window.location.hash = hash;
  }

  this.setMenuIdxByMenuItem = function(highlightMenuItem) {
    for (idx in this.currentMenuItems) {
      if (this.currentMenuItems[idx].id == highlightMenuItem) {
        this.currentMenuIdx = new Number(idx);
        break;
      }
    }
  }

  this.nextMenuItem = function(nextItem) {
    if (this.currentMenuItems.length <= 1) {
      return false;
    }

    if (nextItem == true) {
      this.currentMenuIdx++;
      if (this.currentMenuIdx == this.currentMenuItems.length) {
        this.currentMenuIdx = 0;
      }
    } else {
      this.currentMenuIdx--;
      if (this.currentMenuIdx < 0) {
        this.currentMenuIdx = this.currentMenuItems.length - 1;
      }
    }

    return true;
  }


}
