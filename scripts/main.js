var player = null;

$(function() {
  player = new Player();
  player.init();

   $(document).bind('keyup', function(e) {

        if(e.which == 39){
          $('.carousel').carousel('next');
        }
        else if(e.which == 37){
          $('.carousel').carousel('prev');
        } else if(e.which == 13) {
          player.performAction();
        } else if(e.which == 27) {
          player.performEscAction();
        }
    });
})
