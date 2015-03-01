var MenuTools = function() {}

// the main menu items
MenuTools.mainMenuItems = null;

MenuTools.handleBarTpls = {
  //"mainMenu": Handlebars.compile($("#main-tpl").html()),
  "player": Handlebars.compile($("#player-tpl").html()),
  "menuitem": Handlebars.compile($("#menuitem-tpl").html()),
  // templates for the options
  "options_wrapper": Handlebars.compile($("#options_wrapper-tpl").html()),
  "options_sysinfos": Handlebars.compile($("#options_sysinfos-tpl").html()),
  "options_wifisettings": Handlebars.compile($("#options_wifisettings-tpl").html())
}


/**
 * This loads a source entrance from the backend which can contain files and dirs
 */
MenuTools.loadSourceEntrances = function(id, highlightId) {
  var url = "/sources/" + id.split('?').join('%3F');
  url = Config.baseUrl + url;
  Tools.callBackend(url, function(data) {
    var menuItems = [];

    // check if we only have one audio menu
    if (data.subFolders.length == 0 && data.audioFiles.length == 1) {
      menuItems.push(new PlayerMenuItem(data.audioFiles[0], id + "/" + data.audioFiles[0].name));
      MenuHandler.setCurrentItems(menuItems, highlightId);
      return;
    }

    for (idx in data.subFolders) {
      var subFolder = data.subFolders[idx];
      menuItems.push(new DirectoryMenuItem(subFolder.name, subFolder.thumb, id));
    }

    if (data.audioFiles.length > 1) {
      menuItems.push(new AudioAllFilesMenuItem(id, data.audioFiles));
    }

    for (idx in data.audioFiles) {
      var audioFile = data.audioFiles[idx];
      menuItems.push(new AudioFileMenuItem(audioFile, id));
    }

    MenuHandler.setCurrentItems(menuItems, highlightId);
  });
}

/**
 * Displays a simple std menuitem
 */
MenuTools.displayMenuItem = function(menuItem) {
  MenuTools.displayContent("menuitem", {
    "menuItem": menuItem,
    "menuStack": MenuHandler.menuStack,
    "position": MenuHandler.currentMenuIdx + 1,
    "itemsCount": MenuHandler.currentMenuItems.length
  });
}

MenuTools.displayContent = function(tplName, data, callBack) {
  var content = MenuTools.handleBarTpls[tplName](data);
  $('#mainContainer').html(content);
}

MenuTools.loadMainMenu = function(hilightId) {

  if (MenuTools.mainMenuItems == null) {

    MenuTools.mainMenuItems = [];
    // load all the sources from the backend
    Tools.callBackend(Config.baseUrl + "/sources", function(data) {
      for (idx in data) {
        var source = data[idx];
        MenuTools.mainMenuItems.push(new SourceMenuItem(source));
      }

      // finaly add the options main menu
      MenuTools.mainMenuItems.push(new OptionMainMenuItem());
      MenuHandler.setCurrentItems(MenuTools.mainMenuItems);

    });
  } else {
    MenuHandler.setCurrentItems(MenuTools.mainMenuItems, hilightId);
  }
}
