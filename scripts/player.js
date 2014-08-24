var Directory = function(key,title,parent) {
  this.title = title;
  this.key = key;
  this.subDirs = [];
  this.files = [];
  this.parent = parent;
  this.initialized = false;

  this.addSubDir = function(key,title,player) {
    var dir = new Directory(key,title,this.key);
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

    var file = new File(id,title,mp3Url,duration)

    this.files.push(file);
    player.files[id] = file;

  }
}

var File = function(id,title,mp3,duration) {
  this.id = id;
  this.title = title;
  this.duration = duration;
  this.mp3 = mp3;
}

var Player = function() {

  var that = this;

  this.templates = {};

  this.activeComponent = {
    type : "",
    id : ""
  }

  this.audioJs = null;

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

  this.init = function() {
    this.initTemplats();
    this.loadPlexXml(player.config.baseUrl+"/library/sections", function(data) {
      for(idx in player.config.allowedSections) {
        var sectionId = player.config.allowedSections[idx];
        $('Directory[key="'+sectionId+'"]',data).each(function(i) {
          that.sections[sectionId] = new Directory(sectionId,$(this).attr('title'),-1,player);
          that.directories[sectionId] = that.sections[sectionId];
        });
      }
      that.displayMainMenu();
    });
  }

  this.initTemplats = function() {
    this.templates = {
      "mainMenu" : Handlebars.compile($("#main-tpl").html()),
      "directory" : Handlebars.compile($("#directory-tpl").html()),
      "player" : Handlebars.compile($("#player-tpl").html())
    }
  }

  this.displayMainMenu = function() {
    this.displayContent("mainMenu",{"sections" : this.sections},this.initCarousel);
  }

  this.displayPlayer = function(files,title) {
    this.displayContent("player",{"files": files, "title" : title},this.initPlayer);
  }

  this.displayContent = function(tplName,data,callBack) {
    var content = this.templates[tplName](data);
    this.currentDisplayTpl = tplName;
    $('#mainContainer').html(content);
    Holder.run();
    if(callBack !== undefined) {
      callBack();
    }
  }

  this.initCarousel = function() {
    // mark first item in the carousel and activate it
    $('.carousel .carousel-inner .item').first().addClass('active');
    that.setActiveComponent('.carousel .carousel-inner .active');

    // initialize the carousel
    $('.carousel').carousel();
    $('.carousel').on('slid.bs.carousel', function () {
      that.setActiveComponent('.carousel .carousel-inner .active');
      $('.carousel').carousel('pause');
    });
  }

  this.performAction = function() {
    if(this.activeComponent.type == "section") {
      this.loadSection(this.activeComponent.id);
    }

     if(this.activeComponent.type == "directory") {
       this.loadDirectory(this.activeComponent.id,player.config.baseUrl+this.activeComponent.id);
     }

     if(this.activeComponent.type == "file") {
       var files = [];
       files.push(this.files[this.activeComponent.id]);
       this.displayPlayer(files,this.files[this.activeComponent.id].title);
     }

     if(this.activeComponent.type == "playall") {
       var files = this.directories[this.activeComponent.id].files;
       this.displayPlayer(files,this.directories[this.activeComponent.id].title);
     }
  }

  this.initPlayer = function() {

    var a = audiojs.createAll({
          trackEnded: function() {
            var next = $('ol li.playing').next();
            if (!next.length) next = $('ol li').first();
            next.addClass('playing').siblings().removeClass('playing');
            audio.load($('a', next).attr('data-src'));
            audio.play();
          }
        });

        // Load in the first track
        this.audioJs = a[0];
        var first = $('ol a').attr('data-src');
        $('ol li').first().addClass('playing');
        this.audioJs.load(first);
        this.audioJs.playPause();
  }


  this.performEscAction = function() {
    if(this.currentDisplayTpl == "directory") {
      this.displayMainMenu();
    }
  }

  this.loadSection = function(id) {
    this.loadDirectory(id,player.config.baseUrl+"/library/sections/"+id+"/folder");
  }

  this.loadDirectory = function(id,url) {
    var dir = that.directories[id];

    if(dir.initialized  == false) {
      this.loadPlexXml(url, function(data) {
        $('Directory',data).each(function(i) {
          var key = $(this).attr('key');
          dir.addSubDir(key,$(this).attr('title'),that);
        });

        $('Track',data).each(function(i) {
          dir.addFile($(this),that);
        });
        // we parsed this so mark it
        dir.initialized = true;
        that.displayDir(dir);
      });
    } else {
      this.displayDir(dir);
    }
  }

  this.displayDir = function(directory) {
    this.displayContent("directory",directory,this.initCarousel);
  }

  this.setActiveComponent = function(jqSelector) {
    var type = $(jqSelector).data("type");
    var id = $(jqSelector).data("id");
    this.activeComponent.type = type;
    this.activeComponent.id = id;

    console.error(this.activeComponent);
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
