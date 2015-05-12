/**
 * This handles the stuff for rpi gpio like the display control
 */

var gpio = require('pi-gpio');

function RpiGpio(conf) {

  this.conf = conf;
  var that = this;


  // setup the gpio pin
  gpio.open(this.conf.displayOnOfPin, "output", function(err) {
    that.turnDisplayOn(null);
  });

  /**
   * turns the display on
   */
  this.turnDisplayOn = function(res) {
    this.writeValToPin(1, res)
  }

  /**
   * turns the display off
   */
  this.turnDisplayOff = function(res) {
    this.writeValToPin(0, res);
  }

  /**
   * writes the value to the relay pin
   */
  this.writeValToPin = function(value, res) {
    gpio.write(this.conf.displayOnOfPin, value, function(err) {
      if (err) {
        console.error(err);
        if (res !== null) {
          res.send("FAILURE");
        }
      } else {
        console.log("Set: " + value + " on pin:" + that.conf.displayOnOfPin);
        if (res !== null) {
          res.send("OK");
        }
      }
    });
  }

  /**
   * closes all pins
   */
  this.close = function() {
    gpio.close(that.conf.displayOnOfPin);
    console.log('All pins unexported');
    return process.exit(0);
  }
}

module.exports = RpiGpio;
