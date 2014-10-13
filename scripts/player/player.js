var Player = function(config) {

  var that = this;

  this.templates = {};

  this.audioJsWrapper = new AudioJsWrapper(config.skipSeconds);

  this.config = config;

  this.sections = {};

  this.directories = {};

  this.files = {};

  this.currentDisplayTpl = ""

  this.favMode = true;

  this.loadToStack = [];

  this.keyBoardHandler = new KeyBoardEventHandler(that);
  this.menuHandler = new MenuHandler();

  this.timeOut = null;

  this.displayOff = false;


  this.init = function() {
    that.initTemplats();
    Tools.callBackend(that.config.baseUrl+"/sources", function(data) {
      for(idx in data) {
        var source = data[idx];
        that.sections[source] = new Directory(source,source,undefined,-1);
        that.directories[source] = that.sections[source];
      }

      // check if we have to load from the has
      if(window.location.hash != "") {
        that.loadToStack = window.location.hash.split(",");

        // first is the section
        that.loadToStack[0] = that.loadToStack[0].substring(1);
      }
      that.displayMainMenu();
    });

    if(that.config.sleepTimeOut !== undefined) {
      that.startTimeOut();
    }
  }


  this.initTemplats = function() {
    that.templates = {
      "mainMenu" : Handlebars.compile($("#main-tpl").html()),
      "player" : Handlebars.compile($("#player-tpl").html()),
      "menuitem" : Handlebars.compile($("#menuitem-tpl").html())
    }
  }

  this.displayMainMenu = function() {
    that.menuHandler.initMainMenu(that.sections);
    that.displayContent("mainMenu",{},that.initMenu);
  }


  this.initMenu = function(highlightMenuItem) {
    // do we have a path in the hash url ?
    if(that.loadToStack.length > 0) {
      highlightMenuItem = that.loadToStack[0];
    }

    if(highlightMenuItem === undefined) {
      that.menuHandler.currentMenuIdx = 0;
    } else {
      that.menuHandler.setMenuIdxByMenuItem(highlightMenuItem);
    }
    that.displayMenuItem();
  }

  this.displayMenuItem = function() {
    var menuItem = that.menuHandler.getCurrentMenuItem();
    var content = that.templates["menuitem"]({"menuItem" : menuItem, "menuStack" : that.menuHandler.menuStack, "position" : that.menuHandler.currentMenuIdx+1, "itemsCount" : that.menuHandler.currentMenuItems.length});
    $('#menuContainer').html(content);

    if(that.loadToStack.length > 0) {
      that.loadToStack.shift();
      that.performAction();
    }
  };

  this.nextMenuItem = function(nextItem) {
    var drawNewMenuItem = that.menuHandler.nextMenuItem(nextItem);
    if(drawNewMenuItem == true) {
      that.displayMenuItem();
    }
  }

  this.displayPlayer = function(files,title) {
    that.displayContent("player",{"files": files, "title" : title, "menuStack" : that.menuHandler.menuStack},that.initPlayer);
  }

  this.displayContent = function(tplName,data,callBack) {
    var content = that.templates[tplName](data);
    that.currentDisplayTpl = tplName;
    $('#mainContainer').html(content);
    if(callBack !== undefined) {
      callBack();
    }
  }


  this.performAction = function() {
    var higlightedMenu = that.menuHandler.getCurrentMenuItem();

    var currentMenuItemType = higlightedMenu.type;
    var currentMenuItemId = higlightedMenu.id;

    that.menuHandler.addMenuItemToStack(higlightedMenu);

    if(currentMenuItemType == "section") {
      that.loadSection(currentMenuItemId);
    }

    if(currentMenuItemType == "directory") {
      that.loadDirectory(currentMenuItemId,false);
    }

    if(currentMenuItemType == "file") {
      var files = [];
      files.push(that.files[currentMenuItemId]);
      that.displayPlayer(files,that.files[currentMenuItemId].title);
    }

    if(currentMenuItemType == "playall") {
      var files = that.directories[currentMenuItemId].files;
      that.displayPlayer(files,that.directories[currentMenuItemId].title);
    }
  }


  this.performEscAction = function() {
    var removedMenuItem = that.menuHandler.removeLastMenuItemFromStack();
    if(removedMenuItem == null) {
      return;
    }

    that.audioJsWrapper.stop();

    switch(removedMenuItem.type) {
      case "playall":
        that.loadDirectory(removedMenuItem.id,false);
        break;
        case "file":
        case "directory":
          that.loadDirectory(removedMenuItem.parent,false,removedMenuItem.id);
          break;
        default:
          that.displayMainMenu();
    }
  }

          this.initPlayer = function() {
            // Mark the first track
            $('#playList li').first().addClass('playing');
            that.audioJsWrapper.loadTrack();
          }

          this.loadSection = function(id) {
            that.loadDirectory(id,true);
          }

          /**
          * Load directory from sever
          */
          this.loadDirectory = function(id,section,highlightMenuItem) {
            var url = "/sources/"+id;
            url = that.config.baseUrl+url;

            var dir = that.directories[id];
            if(dir.initialized  == false) {
              Tools.callBackend(url, function(data) {
                for(idx in data.subFolders) {
                  var subFolder = data.subFolders[idx];
                  dir.addSubDir(subFolder.name,subFolder.thumb,that);
                }

                for(idx in data.audioFiles) {
                  var audioFile = data.audioFiles[idx];
                  dir.addFile(audioFile,that);
                }
                // we parsed this so mark it
                dir.initialized = true;
                that.displayDir(dir,highlightMenuItem);
              });
            } else {
              that.displayDir(dir,highlightMenuItem);
            }
          }

          this.displayDir = function(directory,highlightMenuItem) {
            that.menuHandler.initDirectoryMenu(directory);
            that.displayContent("mainMenu",{},function() {that.initMenu(highlightMenuItem) });
          }

  this.startTimeOut = function() {

    if(that.displayOff == true) {
      // make sure the display is on
      $.get(that.config.backenUrl+"/display/on");
    }

    that.displayOff = false;

    clearTimeout(that.timeOut)
    that.timeOut = setTimeout(that.handleTimeOut, that.config.sleepTimeOut * 1000);
  }

  this.handleTimeOut = function() {
    that.displayOff = true;

    // turn off the display
    $.get(that.config.backenUrl+"/display/off");
  }


}
