var Player = function(config) {

  var that = this;

  this.templates = {};

  this.audioJsWrapper = new AudioJsWrapper(config.skipSeconds);

  this.config = config;

  this.sections = {};

  this.directories = {};

  this.files = {};

  this.currentDisplayTpl = ""


  this.loadToStack = [];
  this.keyBoardHandler = new KeyBoardEventHandler(that);
  this.menuHandler = new MenuHandler();


  this.init = function() {
    that.initTemplats();
    that.loadPlexXml(that.config.baseUrl+"/library/sections", function(data) {
      for(idx in that.config.allowedSections) {
        var sectionId = that.config.allowedSections[idx];
        $('Directory[key="'+sectionId+'"]',data).each(function(i) {
          that.sections[sectionId] = new Directory(sectionId,$(this).attr('title'),undefined,-1);
          that.directories[sectionId] = that.sections[sectionId];
        });
      }

      // check if we have to load from the has
      if(window.location.hash != "") {
        that.loadToStack = window.location.hash.split(",");

        // first is the section
        that.loadToStack[0] = that.loadToStack[0].substring(1);
      }
      that.displayMainMenu();
    });
  }

  this.handleKeyDown = function() {

  }

  this.handleKeyUp =  function() {

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

  this.dirToMenuItem = function(dir) {
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
    return menuItems;
  }

  this.initMenu = function(highlightMenuItem) {

    if(that.loadToStack.length > 0) {
      highlightMenuItem = that.loadToStack[0];
    }

    if(highlightMenuItem === undefined) {
      that.currentMenuIdx = 0;
    } else {
      for(idx in that.currentMenuItems) {
        if(that.currentMenuItems[idx].id == highlightMenuItem) {
          that.currentMenuIdx = idx;
          break;
        }
      }
    }
    that.displayMenuItem();
  }

  this.displayMenuItem = function() {
    var menuItem = that.menuHandler.getCurrentMenuItem();
    var content = that.templates["menuitem"]({"menuItem" : menuItem, "menuStack" : that.menuStack});
    $('#menuContainer').html(content);

    if(that.loadToStack.length > 0) {
      that.loadToStack.shift();
      that.performAction();
    }
  };

  this.nextMenuItem = function(nextItem) {
    if(that.currentMenuItems.length <= 1) {
      return;
    }

    if(nextItem == true) {
      that.currentMenuIdx++;
      if(that.currentMenuIdx == that.currentMenuItems.length) {
        that.currentMenuIdx = 0;
      }
    } else {
      that.currentMenuIdx--;
      if(that.currentMenuIdx < 0) {
        that.currentMenuIdx = that.currentMenuItems.length-1;
      }
    }

    that.displayMenuItem();
  }

  this.displayPlayer = function(files,title) {
    that.displayContent("player",{"files": files, "title" : title, "menuStack" : that.menuStack},that.initPlayer);
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

    if(that.menuStack.length == 0) {
      return;
    }

    var currentMenu = that.menuStack.pop();

    that.menuStackToUrlHash();

    // destroy this ? or hold a audiojs instance all the time which would be smarter i guess
    that.audioJsWrapper.stop();


    switch(currentMenu.type) {
      case "playall":
        that.loadDirectory(currentMenu.id,false);
        break;
        case "file":
        case "directory":
          that.loadDirectory(currentMenu.parent,false,currentMenu.id);
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

          this.loadDirectory = function(id,section,highlightMenuItem) {

            var url = (section == true) ? "/library/sections/"+id+"/all" : "/library/metadata/"+id+"/children";
            url = that.config.baseUrl+url;

            var dir = that.directories[id];
            if(dir.initialized  == false) {
              that.loadPlexXml(url, function(data) {
                $('Directory',data).each(function(i) {
                  var id = $(this).attr('ratingKey');
                  var title = $(this).attr('title');
                  if(title != "All tracks") {
                    dir.addSubDir(id,title,$(this).attr('thumb'),that);
                  }
                });

                $('Track',data).each(function(i) {
                  dir.addFile($(this),that);
                });
                // we parsed this so mark it
                dir.initialized = true;
                that.displayDir(dir,highlightMenuItem);
              });
            } else {
              that.displayDir(dir,highlightMenuItem);
            }
          }

          this.displayDir = function(directory,highlightMenuItem) {
            that.currentMenuItems = that.dirToMenuItem(directory);
            that.displayContent("mainMenu",{},function() {that.initMenu(highlightMenuItem) });
          }

  this.loadPlexXml = function(url, callback) {
    $.get(url)
      .done(function(data) {
        $xml = $(data);
        callback($xml);
      })
      .fail(function() {
        alert("error");
      });
  }
}
