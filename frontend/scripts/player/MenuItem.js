/**
 * This is the simpliest menu item we can have
 */
var MenuItem = function() {
  this.title = "No title set";
  this.id = "No id set";
  this.cssClass = "";

  // normal handling of actions take place here
  this.handleKeyEvent = function(actionType, keyWasDown) {

    if (actionType == "left" && MenuHandler.currentMenuItems.length > 1) {
      MenuHandler.displayNextItem(false);
    }
    if (actionType == "right" && MenuHandler.currentMenuItems.length > 1) {
      MenuHandler.displayNextItem(true);
    }
    if (actionType == "action") {
      this.performAction();
    }

    if (actionType == "back") {
      this.performBack();
    }
  }

  this.handleKeyEventDown = function(actionType, keyDownCounter) {}

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
