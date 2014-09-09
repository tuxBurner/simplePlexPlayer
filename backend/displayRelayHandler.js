module.exports =  function(gpioPin,gpio) {
  this._gpioPin = gpioPin;
  this._gpio = gpio;

  this._gpio.setup(this._gpioPin,this._gpio.DIR_OUT);


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
  //this.turnDisplayOn();
}
