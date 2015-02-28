/**
 * The main option menu entrance
 */
var OptionMainMenuItem = function() {
	this.title = "Options";
	this.cssClass = "options";

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	this.performBack = function() {
		return;
	}

	this.loadSubMenuItems = function(highlightId) {
		var menuItems = [];
		menuItems.push(new OptionSysInfoMenuItem());
		MenuHandler.setCurrentItems(menuItems);
	}

	this.performAction = function() {
		this.loadSubMenuItems();
	}
}
OptionMainMenuItem.prototype = new MenuItem;


/**
 * The sys info options menu item
 */
var OptionSysInfoMenuItem = function() {
	this.title = "System Info";
	this.id = "options_sysinfos";
}
OptionSysInfoMenuItem.prototype = new MenuItem;
