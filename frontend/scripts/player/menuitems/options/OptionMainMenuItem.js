/**
 * The main option menu entrance
 */
var OptionMainMenuItem = function() {
	this.title = 'Options';
	this.id = 'main_options';
	this.cssClass = "options";

	this.menuItems = [];
	this.menuItems.push(new OptionSysInfoMenuItem());
	this.menuItems.push(new OptionsMainSettingsMenuItem());

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}

	this.performBack = function() {
		return;
	}

	this.loadSubMenuItems = function(highlightId) {
		MenuHandler.setCurrentItems(this.menuItems, this, highlightId);
	}

	this.performAction = function() {
		this.loadSubMenuItems();
	}
}
OptionMainMenuItem.prototype = new MenuItem;
