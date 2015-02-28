var MenuTools = function() {}
MenuTools.loadSourceEntrances = function(id, highlightId) {
	var url = "/sources/" + id.split('?').join('%3F');
	url = Config.baseUrl + url;
	Tools.callBackend(url, function(data) {
		var menuItems = [];

		// check if we only have one audio menu
		if (data.subFolders.length == 0 && data.audioFiles.length == 1) {
			menuItems.push(new PlayerMenuItem(data.audioFiles[0], id + "/" + data.audioFiles[0].name));
			MenuHandler.setCurrentItems(menuItems, highlightId);
			return;
		}

		for (idx in data.subFolders) {
			var subFolder = data.subFolders[idx];
			menuItems.push(new DirectoryMenuItem(subFolder.name, subFolder.thumb, id));
		}

		if (data.audioFiles.length > 1) {
			menuItems.push(new AudioAllFilesMenuItem(id, data.audioFiles));
		}

		for (idx in data.audioFiles) {
			var audioFile = data.audioFiles[idx];
			menuItems.push(new AudioFileMenuItem(audioFile, id));
		}

		MenuHandler.setCurrentItems(menuItems, highlightId);
	});
}

MenuTools.displayMenuItem = function(menuItem) {
	player.displayContent("menuitem", {
		"menuItem": menuItem,
		"menuStack": MenuHandler.menuStack,
		"position": MenuHandler.currentMenuIdx + 1,
		"itemsCount": MenuHandler.currentMenuItems.length
	});
}

MenuTools.mainMenuItems = null;
MenuTools.loadMainMenu = function(hilightId) {

	if (MenuTools.mainMenuItems == null) {

		MenuTools.mainMenuItems = [];
		// load all the sources from the backend
		Tools.callBackend(Config.baseUrl + "/sources", function(data) {
			for (idx in data) {
				var source = data[idx];
				MenuTools.mainMenuItems.push(new SourceMenuItem(source));
			}

			// finaly add the options main menu
			MenuTools.mainMenuItems.push(new OptionMainMenuItem());
			MenuHandler.setCurrentItems(MenuTools.mainMenuItems);

		});
	} else {
		MenuHandler.setCurrentItems(MenuTools.mainMenuItems, hilightId);
	}
}


/**
 * This is the simpliest menu item we can have
 */
var MenuItem = function() {
	this.title = "No title set";
	this.id = "No id set";
	this.cssClass = "";

	// normal handling of actions take place here
	this.handleKeyEvent = function(actionType) {
		if (actionType == "left") {
			MenuHandler.displayNextItem(false);
		}
		if (actionType == "right") {
			MenuHandler.displayNextItem(true);
		}
		if (actionType == "action") {
			this.performAction();
		}

		if (actionType == "back") {
			this.performBack();
		}
	}

	this.performAction = function() {
		alert("Override me performAction");
	}

	this.performBack = function() {
		MenuHandler.loadParentContent();
	}

	// this is called when the menu item is displaying its content
	this.displayContent = function() {
		alert("Override me displayContent !");
	}

	this.loadSubMenuItems = function(highlightId) {
		alert("Override me loadSubMenuItems !");
	}
}
