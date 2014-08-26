var Directory = function(key,title,thumb,parent) {
  this.title = title;
  this.key = key;
  this.thumb = thumb;
  this.subDirs = [];
  this.files = [];
  this.parent = parent;
  this.initialized = false;

  this.addSubDir = function(key,title,thumb,player) {
    if(thumb !== undefined) {
      thumb = player.config.baseUrl+thumb;
    }
    var dir = new Directory(key,title,thumb,this.key);
    this.subDirs.push(dir);
    player.directories[key] = dir;
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
    $('#playList li.playing .progress').show();
    this.audioJs.load(trackSrc);
    this.audioJs.play();
  }

  this.loadNextTrack = function(nextTitle) {

    var next = null;

    if(nextTitle == true) {
      next = $('#playList li.playing').next();
      if(next.length == 0) next = $('#playList li').first();
    } else {
      next = $('#playList li.playing').prev();
      if(next.length == 0) next = $('#playList li').last();
    }
    // hide all progress bars
    $('#playList .progress').hide();
    $('#playList li.playing').removeClass('playing');
    $(next).addClass('playing');
    this.loadTrack();
  }

  this.updatePercentage = function(percentage) {
    var playedString = Tools.readableDuration(this.audioJs.duration * percentage);
    var percent = Math.round(percentage*100);
    $('#playList li.playing .progress .progress-bar').css("width",percent+"%").html(playedString);
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

  this.init = function() {
    this.initTemplats();
    this.loadPlexXml(player.config.baseUrl+"/library/sections", function(data) {
      for(idx in player.config.allowedSections) {
        var sectionId = player.config.allowedSections[idx];
        $('Directory[key="'+sectionId+'"]',data).each(function(i) {
          that.sections[sectionId] = new Directory(sectionId,$(this).attr('title'),-1,undefined,player);
          that.directories[sectionId] = that.sections[sectionId];
        });
      }
      that.displayMainMenu();
    });
  }

  this.initTemplats = function() {
    this.templates = {
      "mainMenu" : Handlebars.compile($("#main-tpl").html()),
      "player" : Handlebars.compile($("#player-tpl").html()),
      "menuitem" : Handlebars.compile($("#menuitem-tpl").html())
    }
  }

  this.displayMainMenu = function() {
    that.currentMenuItems = [];
    for(idx in that.sections) {
      var section = that.sections[idx];
      that.currentMenuItems.push({"title" : section.title, "id" : section.key, "type" : "section"});
    }
    that.currentMenuItems.push({"title" : "Settings", "id" : "-1" , "type" : "settings"});
    that.displayContent("mainMenu",{},that.initMenu);
  }

  this.dirToMenuItem = function(dir) {
    var menuItems = [];
    for(idx in dir.subDirs) {
      var subDir = dir.subDirs[idx];
      menuItems.push({"title" : subDir.title, "id" : subDir.key, "type" : "directory", "thumb" : subDir.thumb});
    }
    if(dir.files.length > 0) {

      menuItems.push({"title" : "Play All", "id" : dir.key, "type" : "playall"});

      for(idx in dir.files) {
        var file = dir.files[idx];
        menuItems.push({"title" : file.title, "id" : file.id, "type" : "file", "thumb" : file.thumb});
      }
    }
    return menuItems;
  }

  this.initMenu = function() {
    that.currentMenuIdx = 0;
    that.displayMenuItem();
  }

  this.displayMenuItem = function() {
    var menuItem = that.currentMenuItems[that.currentMenuIdx];
    var content = that.templates["menuitem"](menuItem);
    $('#menuContainer').html(content);
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
    this.displayContent("player",{"files": files, "title" : title},this.initPlayer);
  }

  this.displayContent = function(tplName,data,callBack) {
    var content = this.templates[tplName](data);
    this.currentDisplayTpl = tplName;
    $('#mainContainer').html(content);
    if(callBack !== undefined) {
      callBack();
    }
  }


  this.performAction = function() {

    var currentMenuItemType = that.currentMenuItems[that.currentMenuIdx].type;
    var currentMenuItemId = that.currentMenuItems[that.currentMenuIdx].id;

    if(currentMenuItemType == "section") {
      that.loadSection(currentMenuItemId);
    }

     if(currentMenuItemType == "directory") {
       that.loadDirectory(currentMenuItemId,player.config.baseUrl+currentMenuItemId);
     }

     if(currentMenuItemType == "file") {
       var files = [];
       files.push(that.files[currentMenuItemId]);
       that.displayPlayer(files,that.files[currentMenuItemId].title);
     }

     if(currentMenuItemType == "playall") {
       var files = that.directories[currentMenuItemId].files;
       this.displayPlayer(files,that.directories[currentMenuItemId].title);
     }
  }

  this.performEscAction = function() {
    if(this.currentDisplayTpl == "directory") {
      this.displayMainMenu();
    }
  }

  this.initPlayer = function() {
    var audioJs = audiojs.create(document.getElementById('audioJsAudio'),{
          trackEnded: function() {
            that.audioJsWrapper.loadNextTrack(true);
          },
          updatePlayhead: function(percentage) {
            that.audioJsWrapper.updatePercentage(percentage);
          }
        });

    // Mark the first track
    $('#playList li').first().addClass('playing');
    that.audioJsWrapper = new AudioJsWrapper(audioJs);
    that.audioJsWrapper.loadTrack();
  }

  this.loadSection = function(id) {
    that.loadDirectory(id,player.config.baseUrl+"/library/sections/"+id+"/all");
  }

  this.loadDirectory = function(id,url) {
    var dir = that.directories[id];

    if(dir.initialized  == false) {
      that.loadPlexXml(url, function(data) {
        $('Directory',data).each(function(i) {
          var key = $(this).attr('key');
          var title = $(this).attr('title');
          if(title != "All tracks") {
            dir.addSubDir(key,title,$(this).attr('thumb'),that);
          }
        });

        $('Track',data).each(function(i) {
          dir.addFile($(this),that);
        });
        // we parsed this so mark it
        dir.initialized = true;
        that.displayDir(dir);
      });
    } else {
      that.displayDir(dir);
    }
  }

  this.displayDir = function(directory) {
    that.currentMenuItems = that.dirToMenuItem(directory);
    that.displayContent("mainMenu",{},that.initMenu);
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

  this.toXml = function(xmlString) {
    return $.parseXML(xmlString);
  }
}
