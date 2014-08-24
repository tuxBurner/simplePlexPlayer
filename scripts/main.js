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
            var next = $('li.playing').next();
            if (!next.length) next = $('ol li').first();
            next.click();
          }
        // left button
        } else if(e.which == 37){
          if(player.currentDisplayTpl != "player") {
            $('.carousel').carousel('prev');
          }

          if(player.currentDisplayTpl == "player") {
          }
        // enter button
        } else if(e.which == 13) {
          player.performAction();
        } else if(e.which == 27) {
          player.performEscAction();
        }
    });
})
