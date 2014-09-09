/**
* This is the server handling some stuff
*/

// require stuff
var conf = require('./config.json');

/**
* #### THE GPIO STUFF ####
**/
var gpio = require('rpi-gpio');

/**
DEBUG when channel is set
*/
gpio.on('export', function(channel) {
  console.log('Channel set: ' + channel);
});

gpio.setup(conf.displayOnOfPin,gpio.DIR_OUT, turnDisplayOn);

var turnDisplayOn = function() {
  writeValToPin(false);
}

var turnDisplayOff = function() {
  writeValToPin(true);
}

var writeValToPin = function(value) {
  gpio.write(conf.displayOnOfPin, value, function(err) {
    if (err) {
      console.error(err);
    }
  });
}

/**
* #### THE EXPRESS STUFF ####
*/
var express = require('express');
var app = express();
app.get('/display/on', function(req, res){
  turnDisplayOn();
});

app.get('/display/off', function(req, res){
  turnDisplayOff();
});

var server = app.listen(conf.serverPort, function() {
    console.log('Listening on port %d', server.address().port);
});


/**
* #### HANDLE SHUTDOWN ####
*/
process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here

  // clean all gpio pins
  gpio.destroy(function() {
       console.log('All pins unexported');
        return process.exit(0);
  });
});
