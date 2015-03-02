/**
 * Simple menu item doing nothing special
 */
var OptionsMainSettingsMenuItem = function() {
	this.title = 'Wifi Settings';
	this.cssClass = 'options';
	this.id = 'main_options_wifi'

	this.loadSubMenuItems = function(highlightId) {
		var menuItems = [];
		menuItems.push(new OptionWifiSettingsMenuItem());
		MenuHandler.setCurrentItems(menuItems, this);
	}

	this.performAction = function() {
		this.loadSubMenuItems();
	}

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}
}
OptionsMainSettingsMenuItem.prototype = new MenuItem;
