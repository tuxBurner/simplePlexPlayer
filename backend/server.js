/**
* This is the server handling some stuff
*/

// require stuff
var conf = require('./config.json');

/**
* #### THE GPIO STUFF ####
**/
var gpio   = require('rpi-gpio');

/**
DEBUG when channel is set
*/
gpio.on('export', function(channel) {
  console.debug('Channel set: ' + channel);
});

var DisplayHandler = require('./displayRelayHandler.js');
var displayHandler = new DisplayHandler(conf.displayOnOfPin,gpio);

/**
* #### THE EXPRESS STUFF ####
*/
var express = require('express');
var app = express();
app.get('/display/on', function(req, res){
  displayHandler.turnDisplayOn();
});

app.get('/display/off', function(req, res){
  displayHandler.turnDisplayOff();
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
