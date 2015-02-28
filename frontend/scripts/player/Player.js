var Player = function(config) {

	var that = this;

	this.templates = {};

	this.audioJsWrapper = new AudioJsWrapper(config.skipSeconds, config.repeatAll);

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



	this.displayPlayer = function(files, title) {
		that.displayContent("player", {
			"files": files,
			"title": title,
			"menuStack": that.menuHandler.menuStack
		}, that.initPlayer);
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
	 * Performs an action on the current menu item
	 */
	/*	this.performAction = function() {
			var higlightedMenu = that.menuHandler.getCurrentMenuItem();

			var currentMenuItemType = higlightedMenu.type;
			var currentMenuItemId = higlightedMenu.id;

			that.menuHandler.addMenuItemToStack(higlightedMenu);

			if (currentMenuItemType == "section") {
				that.loadSection(currentMenuItemId);
			}

			if (currentMenuItemType == "directory") {
				that.loadDirectory(currentMenuItemId, false);
			}

			if (currentMenuItemType == "file") {
				var files = [];
				files.push(that.files[currentMenuItemId]);
				that.displayPlayer(files, that.files[currentMenuItemId].title);
			}

			if (currentMenuItemType == "playall") {
				var files = that.directories[currentMenuItemId].files;
				that.displayPlayer(files, that.directories[currentMenuItemId].title);
			}

			if (currentMenuItemType == "options") {
				that.displayOptions(currentMenuItemId);
			}
		}*/


	/**
	 * Performs an escap action on the current menu item
	 */
	/*this.performEscAction = function() {
		var removedMenuItem = that.menuHandler.removeLastMenuItemFromStack();
		if (removedMenuItem == null) {
			return;
		}

		that.audioJsWrapper.stop();

		switch (removedMenuItem.type) {
			case "playall":
				that.loadDirectory(removedMenuItem.id, false);
				break;
			case "file":
			case "directory":
				that.loadDirectory(removedMenuItem.parent, false, removedMenuItem.id);
				break;
			case "options":
				window.location.hash = '';
				that.displayMainMenu();
				break;
			default:
				window.location.hash = '';
				that.displayMainMenu();
		}
	}*/

	this.initPlayer = function() {
		// Mark the first track
		$('#playList li').first().addClass('playing');
		that.audioJsWrapper.loadTrack();
	}

	//this.loadSection = function(id) {
	//	that.loadDirectory(id, true);
	//}

	/**
	 * Load directory from sever
	 */
	/*this.loadDirectory = function(id, section, highlightMenuItem) {
		var url = "/sources/" + id.split('?').join('%3F');

		url = that.config.baseUrl + url;

		var dir = that.directories[id];

		Tools.callBackend(url, function(data) {

			dir.cleanSubs();

			for (idx in data.subFolders) {
				var subFolder = data.subFolders[idx];
				dir.addSubDir(subFolder.name, subFolder.thumb, subFolder.disableCaching,
					that);
			}

			for (idx in data.audioFiles) {
				var audioFile = data.audioFiles[idx];
				dir.addFile(audioFile, that);
			}

			that.displayDir(dir, highlightMenuItem);
		});

	}*/

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

	this.displayDir = function(directory, highlightMenuItem) {
		that.menuHandler.initDirectoryMenu(directory);
		that.displayContent("mainMenu", {}, function() {
			that.initMenu(highlightMenuItem)
		});
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
