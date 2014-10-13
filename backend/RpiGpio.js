/**
* This handles the stuff for rpi gpio like the display control
*/

var gpio = require('rpi-gpio');

function RpiGpio(conf) {

  this.conf = conf;     
    
  /**
  * DEBUG when channel is set
  */
  gpio.on('export', function(channel) {
    console.log('Channel set: ' + channel);
  });

  // setup the gpio pin
  gpio.setup(this.conf.displayOnOfPin,gpio.DIR_OUT, turnDisplayOn);

  /**
  * turns the display on
  */
  this.turnDisplayOn = function(res) {
    writeValToPin(true,res)
  }

  /**
  * turns the display off
  */
  this.turnDisplayOff = function(res) {
    writeValToPin(false,res);
  }

  /**
  * writes the value to the relay pin
  */
  this.writeValToPin = function(value,res) {
    gpio.write(this.conf.displayOnOfPin, value, function(err) {
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
  * closes all pins
  */
  this.close = function() {
    // clean all gpio pins
    gpio.destroy(function() {
         console.log('All pins unexported');
          return process.exit(0);
    });
  }
}

module.exports = RpiGpio;
