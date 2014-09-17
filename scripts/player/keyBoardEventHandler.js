var KeyBoardEventHandler = function(player) {

  this.player = player;
  this.lastTimeStamp = null;
  this.eventTriggered = 0;
  this.keyMapping = player.config.keyMapping;
  this.rotaryMode = player.config.rotaryInput;
  this.rotaryEventTimeout = player.config.rotaryEventTimeout;

  var that = this;

  $(document).bind('keydown', function(e) {
    that.handleKeyDown(e);
  });
  $(document).bind('keyup',function(e) {
    that.handleKeyUp(e);
  });

  this.handleKeyDown = function(e) {

    // we cant use this when in rotary mode
    if(that.rotaryMode == true) {
      return;
    }

    if(that.lastTimeStamp != null) {
      var diff = e.timeStamp - that.lastTimeStamp;
      if(diff >= that.player.config.skipSeconds.eventTimeOut) {
        that.eventTriggered++;
        that.lastTimeStamp = e.timeStamp;
        if(that.player.currentDisplayTpl == "player") {
          that.playerForward(e);
        }
      }
    } else {
      that.lastTimeStamp = e.timeStamp;
    }
  }

  this.handleKeyUp = function(e) {

    // display off well pushing any button just turns it on nothing else
    if(that.player.displayOff == true) {
      that.player.startTimeOut();
      return;
    }


    if(that.rotaryMode == true && (that.keyMapping.left == e.which || that.keyMapping.right == e.which) && that.player.currentDisplayTpl == "player") {
         if(that.lastTimeStamp == null) {
          that.lastTimeStamp = e.timeStamp;
          return;
        }
        // get the diff
        var diff = e.timeStamp - that.lastTimeStamp;
        if(diff < that.rotaryEventTimeout) {
          that.eventTriggered++;
          that.playerForward(e);
          that.lastTimeStamp = e.timeStamp;
          return;

        }
    }

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

  this.playerForward = function(e) {
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
