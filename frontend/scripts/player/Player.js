var Player = function() {

  var that = this;

  this.keyBoardHandler = new KeyBoardEventHandler(this);

  this.timeOut = null;

  this.displayOff = false;


  /**
   * Initializes the player
   */
  this.init = function() {


    MenuTools.loadMainMenu();
    if (Config.sleepTimeOut !== undefined) {
      that.startTimeOut();
    }
  }

  this.startTimeOut = function() {
    if (that.displayOff == true) {
      // make sure the display is on
      $.get(Config.baseUrl + "/display/on");
    }

    that.displayOff = false;

    clearTimeout(that.timeOut)
    that.timeOut = setTimeout(that.handleTimeOut, Config.sleepTimeOut * 1000);
  }

  this.handleTimeOut = function() {
    that.displayOff = true;

    // turn off the display
    $.get(Config.baseUrl + "/display/off");
  }


}
