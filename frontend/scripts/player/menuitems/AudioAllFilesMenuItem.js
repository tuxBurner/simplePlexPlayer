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