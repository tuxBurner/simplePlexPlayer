var Directory = function(id,title,thumb,parent) {
  this.title = title;
  this.id = id;
  this.thumb = thumb;
  this.subDirs = [];
  this.files = [];
  this.parent = parent;
  this.initialized = false;

  this.addSubDir = function(id,title,thumb,player) {
    if(thumb !== undefined) {
      thumb = player.config.baseUrl+thumb;
    } else {
      thumb = this.thumb;
    }
    var dir = new Directory(id,title,thumb,this.id);
    this.subDirs.push(dir);
    player.directories[id] = dir;
  }

  this.addFile = function(fileXml,player) {
    var mediaXml = $(fileXml).find("Media");
    var partXml = $(fileXml).find("Part");

    var duration = $(mediaXml).attr('duration');
    var title = $(fileXml).attr('title');
    var id = $(partXml).attr('id');
    var mp3Url = player.config.baseUrl+"/library/parts/"+id+"/file.mp3";

    var readableDuration = Tools.readableDuration((duration / 1000));
    var file = new File(id,title,mp3Url,this.thumb,readableDuration);

    this.files.push(file);
    player.files[id] = file;
  }
}

var File = function(id,title,mp3,thumb,readableDuration) {
  this.id = id;
  this.title = title;
  this.thumb = thumb;
  this.mp3 = mp3;
  this.duration = readableDuration;
}


var AudioJsWrapper = function(audioJs) {
  this.audioJs = audioJs;

  this.total = undefined;

  this.loadTrack =  function() {
    var trackSrc = $('#playList li.playing').attr('data-src');
    this.audioJs.load(trackSrc);
    this.audioJs.play();
  }

  this.loadNextTrack = function(nextTitle) {

    var next = null;

    var scrollPos = $('#playListWrapper').data("scrollpos");
    var scrollOffset = 0;

    if(nextTitle == true) {
      next = $('#playList li.playing').next();
      if(next.length == 0) {
        next = $('#playList li').first();
        scrollPos = 0;
      } else {
        scrollPos+=$(next).outerHeight(true);
      }
    } else {
      next = $('#playList li.playing').prev();
      if(next.length == 0) {
        next = $('#playList li').last();
        scrollPos=$('#playList').height()-$(next).outerHeight(true);;
      } else {
        scrollPos-=$('#playList li.playing').outerHeight(true);
      }
    }

    // hide all progress bars
    $('#playList li.playing').removeClass('playing');
    $(next).addClass('playing');

    // scroll the container
    $('#playListWrapper').scrollTop(scrollPos)
    $('#playListWrapper').data("scrollpos",scrollPos);

    this.loadTrack();
  }

  this.updatePercentage = function(percentage) {
    var playedString = Tools.readableDuration(this.audioJs.duration * percentage);
    var percent = Math.round(percentage*100);
    $('#playList li.playing .progress .progress-bar').css("width",percent+"%").html(playedString);
  }

  this.stop = function() {
    if(this.audioJs.playing == true) {
      this.audioJs.pause();
    }
  }
}

var Tools =  function() {}
Tools.readableDuration = function(duration) {
  var m = Math.floor(duration / 60);
  var s = Math.floor(duration % 60);
  return ((m<10?'0':'')+m+':'+(s<10?'0':'')+s);
}

var Player = function() {

  var that = this;

  this.templates = {};

  this.audioJsWrapper = null;

  this.config = {
    // path to the the plex server
    "baseUrl" :  "http://192.168.0.133:32400",
    // allowed sections to play you can get them from http://192.168.0.133:32400/library/sections
    "allowedSections" : [4]
  }

  this.sections = {};

  this.directories = {};

  this.files = {};

  this.currentDisplayTpl = ""

  this.currentMenuItems = [];
  this.currentMenuIdx = 0;

  this.menuStack = [];

  this.loadToStack = [];


  this.init = function() {

    // initialize the player
    var audioJs = audiojs.create(document.getElementById('audioJsAudio'),{
      trackEnded: function() {
        that.audioJsWrapper.loadNextTrack(true);
      },
      updatePlayhead: function(percentage) {
        that.audioJsWrapper.updatePercentage(percentage);
      }
    });

    that.audioJsWrapper = new AudioJsWrapper(audioJs);

    that.initTemplats();
    that.loadPlexXml(player.config.baseUrl+"/library/sections", function(data) {
      for(idx in player.config.allowedSections) {
        var sectionId = player.config.allowedSections[idx];
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

  this.initTemplats = function() {
    that.templates = {
      "mainMenu" : Handlebars.compile($("#main-tpl").html()),
      "player" : Handlebars.compile($("#player-tpl").html()),
      "menuitem" : Handlebars.compile($("#menuitem-tpl").html())
    }
  }

  this.displayMainMenu = function() {
    that.currentMenuItems = [];
    for(idx in that.sections) {
      var section = that.sections[idx];
      that.currentMenuItems.push({"title" : section.title, "id" : section.id, "type" : "section"});
    }
    that.currentMenuItems.push({"title" : "Settings", "id" : "-1" , "type" : "settings"});
    that.displayContent("mainMenu",{},that.initMenu);
  }

  this.dirToMenuItem = function(dir) {
    var menuItems = [];
    for(idx in dir.subDirs) {
      var subDir = dir.subDirs[idx];
      menuItems.push({"title" : subDir.title, "id" : subDir.id, "type" : "directory", "thumb" : subDir.thumb, "parent" : dir.id});
    }
    if(dir.files.length > 1) {
      menuItems.push({"title" : "Play All", "id" : dir.id, "type" : "playall", "thumb" : dir.thumb});
    }
    for(idx in dir.files) {
      var file = dir.files[idx];
      menuItems.push({"title" : file.title, "id" : file.id, "type" : "file", "thumb" : file.thumb, "parent" : dir.id});
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
    var menuItem = that.currentMenuItems[that.currentMenuIdx];
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

    var higlightedMenu = that.currentMenuItems[that.currentMenuIdx];

    var currentMenuItemType = higlightedMenu.type;
    var currentMenuItemId = higlightedMenu.id;

    that.menuStack.push(higlightedMenu);

    that.menuStackToUrlHash();


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

  this.menuStackToUrlHash = function() {
    var hash = "";
    if(that.menuStack.length > 0) {
      var sep = "";
      for(idx in that.menuStack) {
        hash+=sep+that.menuStack[idx].id;
        sep = ",";
      }
    }
    window.location.hash = hash;
  }

  this.performEscAction = function() {
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
