var player = null;


var Config = {
  // path to the the backend server
  "baseUrl": "http://localhost:8080",
  "repeatAll": false,
  "skipSeconds": {
    "slow": 10,
    "fast": 20,
    "fastTrigger": 10,
    "eventTimeOut": 150
  },
  "keyMapping": {
    "left": 37,
    "right": 39,
    "back": 27,
    "action": 13
  },
  "rotaryInput": true,
  "rotaryEventTimeout": 750,
  "sleepTimeOut": 600
}

$(function() {
  player = new Player();
  player.init();
})
