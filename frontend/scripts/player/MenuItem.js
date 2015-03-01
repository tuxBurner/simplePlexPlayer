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

	this.handleKeyEventDown = function(actionType) {}

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
