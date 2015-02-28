//TODO: delete me !
var MenuItem = function(obj, type, parentId) {
	this.id = obj.id;
	this.title = obj.title;
	this.type = type;
	this.displayCallBack = obj.displayCallBack;
	this.thumb = obj.thumb;
	this.parent = parentId;
}


/**
 * This is the simpliest menu item we can have
 */
var MenuItem2 = function() {
	this.title = "No title set";
	this.id = "No id set"

	// normal handling of actions take place here
	this.performAction = function(actionType) {
		if (actionType == "left") {
			MenuHandler.displayNextItem(false);
		}
		if (actionType == "right") {
			MenuHandler.displayNextItem(true);
		}
	}

	// this is called when the menu item is displaying its content
	this.displayContent = function() {
		alert("Override me !");
	}
}


/**
 * This is the Menuitem which represents a folder which can contain subFolders and audio files
 */
var SourceMenuItem = function(title, id) {
	this.title = title;
	this.id = id;

	this.displayContent = function(player) {
		player.displayContent("menuitem", {
			"menuItem": this,
			"menuStack": MenuHandler.currentMenuStack,
			"position": MenuHandler.position + 1,
			"itemsCount": MenuHandler.itemsCount
		});
	}
}
SourceMenuItem.prototype = new MenuItem2;

/**
 * Holds an AudioItem
 */
var AudioMenuItem = function() {

}
AudioMenuItem.prototype = new MenuItem2;
