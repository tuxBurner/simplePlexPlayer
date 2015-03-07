/**
 * Simple menu item doing nothing special
 */
var SimpleMenuItem = function(id, title, cssClass, options) {
	this.id = id;
	this.title = title;
	this.cssClass = cssClass;
	this.options = options;

	this.loadSubMenuItems = function(highlightId) {
		if (this.options !== undefined && this.options.loadSubMenuItems !== undefined) {
			this.options.loadSubMenuItems(highlightId);
			return;
		}

		return [];
	}

	this.performAction = function() {
		if (this.options !== undefined && this.options.performAction !== undefined) {
			this.options.performAction();
			return;
		}

		this.loadSubMenuItems();
	}

	this.displayContent = function() {
		MenuTools.displayMenuItem(this);
	}
}
SimpleMenuItem.prototype = new MenuItem;
