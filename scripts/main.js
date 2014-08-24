var player = null;

$(function() {
  player = new Player();
  player.init();

   $(document).bind('keyup', function(e) {

        // right button
        if(e.which == 39){
          if(player.currentDisplayTpl != "player") {
            $('.carousel').carousel('next');
          }

          if(player.currentDisplayTpl == "player") {
            player.audioJsWrapper.loadNextTrack(true);
          }
        // left button
        } else if(e.which == 37){
          if(player.currentDisplayTpl != "player") {
            $('.carousel').carousel('prev');
          }

          if(player.currentDisplayTpl == "player") {
            if(player.currentDisplayTpl == "player") {
              player.audioJsWrapper.loadNextTrack(false);
            }
          }
        // enter button
        } else if(e.which == 13) {
          player.performAction();
        } else if(e.which == 27) {
          player.performEscAction();
        }
    });
})
