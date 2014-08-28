$(function() {

  var config = {
    // path to the the plex server
    "baseUrl" :  "http://192.168.0.133:32400",
    // allowed sections to play you can get them from http://192.168.0.133:32400/library/sections
    "allowedSections" : [4],
    "skipSeconds" : { "slow" : 10,
                      "fast" : 20,
                      "fastTrigger" : 4,
                      "eventTimeOut" : 150
                    }
  }

  var player = new Player(config);
  player.init();
})
