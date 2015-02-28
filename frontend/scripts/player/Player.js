var Player = function(config) {

  var that = this;

  this.templates = {};

  //this.audioJsWrapper = new AudioJsWrapper(config.skipSeconds, config.repeatAll);

  this.config = config;


  this.currentDisplayTpl = ""


  this.keyBoardHandler = new KeyBoardEventHandler(that);
  this.optionsHandler = new OptionsHandler(that);

  this.timeOut = null;

  this.displayOff = false;


  /**
   * Initializes the player
   */
  this.init = function() {


    MenuTools.loadMainMenu();
    if (that.config.sleepTimeOut !== undefined) {
      that.startTimeOut();
    }
  }



  this.startTimeOut = function() {
    if (that.displayOff == true) {
      // make sure the display is on
      $.get(that.config.baseUrl + "/display/on");
    }

    that.displayOff = false;

    clearTimeout(that.timeOut)
    that.timeOut = setTimeout(that.handleTimeOut, that.config.sleepTimeOut *
      1000);
  }

  this.handleTimeOut = function() {
    that.displayOff = true;

    // turn off the display
    $.get(that.config.baseUrl + "/display/off");
  }


}
