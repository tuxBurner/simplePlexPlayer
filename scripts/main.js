var player = null;
$(function() {

  var config = {
    // path to the the plex server
    "baseUrl" :  "http://192.168.0.133:32400",
    // allowed sections to play you can get them from http://192.168.0.133:32400/library/sections
    "allowedSections" : [4],
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
    "backenUrl" : "http://192.168.0.150:8080",
    "sleepTimeOut" : 10
  }

  player = new Player(config);
  player.init();
})
