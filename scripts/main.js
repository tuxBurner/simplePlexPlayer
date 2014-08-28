var player = null;

var lastTimeStamp = null;
var eventTriggered = 0;

$(function() {
  player = new Player();
  player.init();


  $(document).bind('keydown', function(e) {
    if(lastTimeStamp != null) {
      var diff = e.timeStamp - lastTimeStamp;
      if(diff >= 250) {
        eventTriggered++;
        lastTimeStamp = e.timeStamp;
        if(player.currentDisplayTpl == "player") {
          if(e.which == 39) {
            player.audioJsWrapper.fwd(true);
          }

          if(e.which == 37) {
            player.audioJsWrapper.fwd(false);
          }
        }
      }
    } else {
      lastTimeStamp = e.timeStamp;
    }
  });

   $(document).bind('keyup', function(e) {

        // reset last timestamp
        lastTimeStamp = null;

        // right button
        if(e.which == 39){
          if(player.currentDisplayTpl != "player") {
            player.nextMenuItem(true);
          }
          if(player.currentDisplayTpl == "player") {
            if(eventTriggered == 0) {
              player.audioJsWrapper.loadNextTrack(true);
            }
          }
        // left button
        } else if(e.which == 37){
          if(player.currentDisplayTpl != "player") {
            player.nextMenuItem(false);
          }
          if(player.currentDisplayTpl == "player") {
            if(player.currentDisplayTpl == "player") {
              if(eventTriggered == 0) {
                player.audioJsWrapper.loadNextTrack(false);
              }
            }
          }
        // enter button
        } else if(e.which == 13) {
          if(player.currentDisplayTpl != "player") {
            player.performAction();
          } else {
            player.audioJsWrapper.audioJs.playPause();
          }
        } else if(e.which == 27) {
          player.performEscAction();
        }

        eventTriggered = 0;

    });
})
