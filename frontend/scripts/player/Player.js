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
		that.initTemplats();

		MenuTools.loadMainMenu();
		if (that.config.sleepTimeOut !== undefined) {
			that.startTimeOut();
		}
	}


	/**
	 * Initializes the handlebar templates and caches them
	 */
	this.initTemplats = function() {
		that.templates = {
			"mainMenu": Handlebars.compile($("#main-tpl").html()),
			"player": Handlebars.compile($("#player-tpl").html()),
			"menuitem": Handlebars.compile($("#menuitem-tpl").html()),
			// templates for the options
			"options_wrapper": Handlebars.compile($("#options_wrapper-tpl").html()),
			"options_sysinfos": Handlebars.compile($("#options_sysinfos-tpl").html()),
			"options_wifisettings": Handlebars.compile($(
				"#options_wifisettings-tpl").html())
		}
	}



	this.displayContent = function(tplName, data, callBack) {
		var content = that.templates[tplName](data);
		that.currentDisplayTpl = tplName;
		$('#mainContainer').html(content);
		if (callBack !== undefined) {
			callBack();
		}
	}


	/**
	 * Display the current options
	 */
	this.displayOptions = function(currentMenuItemId) {
		// we just want to display the option menu items ?
		if (currentMenuItemId == "opts_main") {
			that.menuHandler.initOptionMenu();
			that.displayContent("mainMenu", {}, function() {
				that.initMenu()
			});
		} else {
			that.optionsHandler.getOptionsMenuItems(currentMenuItemId);
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
