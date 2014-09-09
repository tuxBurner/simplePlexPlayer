module.exports =  function(gpioPin,gpio) {
  this.gpioPin = gpioPin;
  this.gpio = gpio;

  gpio.setup(gpioPin, gpio.DIR_OUT);


  this.turnDisplayOn = function() {
    this.writeValToPin(false);
  }

  this.turnDisplayOff = function() {
    this.writeValToPin(true);
  }

  this.writeValToPin = function(value) {
    this.gpio.write(this.gpioPin, value, function(err) {
      if (err) {
        console.error(err);
      }
    });
  }

  // make sure display is turned on
  this.turnDisplayOn();
}
