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

/**
* turns the display on
*/
var turnDisplayOn = function(res) {
  writeValToPin(true,res)
}

/**
* turns the display off
*/
var turnDisplayOff = function(res) {
  writeValToPin(false,res);
}

/**
* writes the value to the relay pin
*/
var writeValToPin = function(value,res) {
  gpio.write(conf.displayOnOfPin, value, function(err) {
    if (err) {
      console.error(err);
      if(res !== null) {
        res.send("FAILURE");
      }
    } else {
      console.log();
      if(res !== null) {
        res.send("OK");
      }
    }
  });
}

/**
* #### THE EXPRESS STUFF ####
*/
var express = require('express');
var app = express();
app.get('/display/on', function(req, res){
  turnDisplayOn(res);
});

app.get('/display/off', function(req, res){
  turnDisplayOff(res);
});

var server = app.listen(conf.serverPort, function() {
    console.log('Listening on port %d', server.address().port);
    // setup the gpio pin
    gpio.setup(conf.displayOnOfPin,gpio.DIR_OUT, turnDisplayOn);
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
