var player = null;
$(function() {

  var config = {
    // path to the the plex server
    "baseUrl" :  "http://localhost:8080",
    // allowed sections to play you can get them from http://192.168.0.133:32400/library/sections
    //"allowedSections" : [4],
    "repeatAll" :  false,
    "skipSeconds" : {
      "slow" : 10,
      "fast" : 20,
      "fastTrigger" : 10,
      "eventTimeOut" : 150
    },
    "keyMapping" : {
      "left" : 37,
      "right" : 39,
      "back" : 27,
      "action" : 13
    },
    "rotaryInput" : true,
    "rotaryEventTimeout" : 750,
    "backenUrl" : "http://localhost:8080",
    "sleepTimeOut" : 600
  }

  player = new Player(config);
  player.init();
})
