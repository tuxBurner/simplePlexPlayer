var KeyBoardEventHandler = function(player) {

  this.player = player;
  this.lastTimeStamp = null;
  this.eventTriggered = 0;
  this.keyMapping = player.config.keyMapping;

  var that = this;

  $(document).bind('keydown', function(e) {
    that.handleKeyDown(e);
  });
  $(document).bind('keyup',function(e) {
    that.handleKeyUp(e);
  });

  this.handleKeyDown = function(e) {
    if(that.lastTimeStamp != null) {
      var diff = e.timeStamp - that.lastTimeStamp;
      if(diff >= that.player.config.skipSeconds.eventTimeOut) {
        that.eventTriggered++;
        that.lastTimeStamp = e.timeStamp;
        if(that.player.currentDisplayTpl == "player") {
          switch(e.which) {
            case that.keyMapping.left:
              that.player.audioJsWrapper.fwd(false,that.eventTriggered);
              break;
            case that.keyMapping.right:
              that.player.audioJsWrapper.fwd(true,that.eventTriggered);
              break;
          }
        }
      }
    } else {
      that.lastTimeStamp = e.timeStamp;
    }
  }

  this.handleKeyUp = function(e) {
    // reset last timestamp
    that.lastTimeStamp = null;
    switch(e.which) {
      case that.keyMapping.left:
        if(that.player.currentDisplayTpl != "player") {
          that.player.nextMenuItem(false);
        } else {
          if(that.eventTriggered == 0) {
            that.player.audioJsWrapper.loadNextTrack(false);
          }
        }
        break;
      case that.keyMapping.right:
        if(that.player.currentDisplayTpl != "player") {
          that.player.nextMenuItem(true);
        } else {
          if(that.eventTriggered == 0) {
            that.player.audioJsWrapper.loadNextTrack(true);
          }
        }
        break;
      case that.keyMapping.back:
        that.player.performEscAction();
        break;
      case that.keyMapping.action:
        if(that.player.currentDisplayTpl != "player") {
          that.player.performAction();
        } else {
          that.player.audioJsWrapper.audioJs.playPause();
        }
        break;
    }

    // make sure that triggeredCounter is 0
    that.eventTriggered = 0;

    // user interaction means new sleeptimeout
    that.player.startTimeOut();

  }
}
