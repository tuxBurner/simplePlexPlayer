var player = null;


var Config = {
	// path to the the backend server
	"baseUrl": "http://localhost:8080",
	"repeatAll": false,
	"skipSeconds": {
		"slow": 10,
		"fast": 20,
		"fastTrigger": 10
	},
	"keyMapping": {
		"left": 37,
		"right": 39,
		"back": 27,
		"action": 13
	},
	"rotaryInput": true,
	"eventTimeOut": 250,
	"rotaryEventTimeout": 250,
	"sleepTimeOut": 60
}

$(function() {
	player = new Player();
	player.init();
})
