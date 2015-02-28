var MenuTools = function() {}
MenuTools.loadSourceEntrances = function(id, highlightId) {
	var url = "/sources/" + id.split('?').join('%3F');
	url = Config.baseUrl + url;
	Tools.callBackend(url, function(data) {
		var menuItems = [];

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

var OptionMainMenuItem = function() {
	this.title = "Options";
	this.cssClass = "options";

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	this.performBack = function() {
		return;
	}
}
OptionMainMenuItem.prototype = new MenuItem;


/**
 * This is the Menuitem which represents a folder which can contain subFolders and audio files
 */
var SourceMenuItem = function(title) {
	this.title = title;
	this.id = title;
	this.cssClass = "directory";

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	this.loadSubMenuItems = function(highlightId) {
		MenuTools.loadSourceEntrances(this.id, highlightId);
	}

	this.performAction = function() {
		this.loadSubMenuItems();
	}

	// do nothing this is the main menu
	this.performBack = function() {
		return;
	}

}
SourceMenuItem.prototype = new MenuItem;

var DirectoryMenuItem = function(title, thumb, parentId) {
	this.title = title;
	this.id = parentId + "/" + title;
	this.thumb = thumb;
	this.cssClass = "directory";

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	this.loadSubMenuItems = function(highlightId) {
		MenuTools.loadSourceEntrances(this.id, highlightId);
	}

	this.performAction = function() {
		this.loadSubMenuItems();
	}
}
DirectoryMenuItem.prototype = new MenuItem;

var AudioFileMenuItem = function(audioFile, parentId) {
	this.title = audioFile.name;
	this.id = parentId + "/" + audioFile.name;
	this.thumb = audioFile.thumb;
	this.cssClass = "file";
	this.audioFile = audioFile;

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	// noop
	this.loadSubMenuItems = function(highlightId) {
		return;
	}

	this.performAction = function() {
		var menuItems = [];
		menuItems.push(new PlayerMenuItem(audioFile, this.id));
		MenuHandler.setCurrentItems(menuItems);
	}
}
AudioFileMenuItem.prototype = new MenuItem;

var PlayerMenuItem = function(audioFile, parentId) {
	this.audioFile = audioFile;
	this.streamUrl = Config.baseUrl + '/sources/' + parentId.split('?').join('%3F');
	this.id = parentId + "_player";
	this.title = "Play: " + audioFile.name;
	this.thumb = audioFile.thumb;

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
		AudioPlayer.loadTrack(this.streamUrl);
	}

	this.handleKeyEvent = function(actionType) {
		if (actionType == "left") {
			// todo fwwd
			MenuHandler.displayNextItem(false);
		}
		if (actionType == "right") {
			// todo bkwd
			MenuHandler.displayNextItem(true);
		}
		if (actionType == "action") {
			AudioPlayer.audioJs.playPause();
		}

		if (actionType == "back") {
			AudioPlayer.stop();
			this.performBack();
		}
	}


}
PlayerMenuItem.prototype = new MenuItem;


var AudioAllFilesMenuItem = function(parentId, audioFiles) {
	this.title = "Play all";
	this.id = parentId + "_playall";
	this.parentId = parentId;
	this.cssClass = "playall";
	this.audioFiles = audioFiles;

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	this.loadSubMenuItems = function(highlightId) {
		var menuItems = [];
		for (idx in this.audioFiles) {
			var audioFile = this.audioFiles[idx];
			menuItems.push(new PlayerMenuItem(audioFile, this.parentId + "/" + audioFile.name));
		}
		MenuHandler.setCurrentItems(menuItems);
	}

	this.performAction = function() {
		this.loadSubMenuItems();
	}

}
AudioAllFilesMenuItem.prototype = new MenuItem;
