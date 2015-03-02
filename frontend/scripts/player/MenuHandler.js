var MenuHandler = function() {}
MenuHandler.currentMenuItems = [];
MenuHandler.currentMenuIdx = 0;
MenuHandler.menuStack = [];

MenuHandler.setCurrentItems = function(menuItems, highlightId) {
  if (menuItems.length == 0) {
    return;
  }

  if (MenuHandler.currentMenuItems.length > 0 && highlightId === undefined) {
    var currentMenuItem = MenuHandler.getCurrentMenuItem();
    MenuHandler.menuStack.push(currentMenuItem);
  }

  MenuHandler.currentMenuIdx = 0;
  // hilight a menu in the current menus so find the idx in the array if set
  if (highlightId !== undefined) {
    for (idx in menuItems) {
      if (menuItems[idx].id == highlightId) {
        MenuHandler.currentMenuIdx = Number(idx);
        break;
      }
    }
  }


  MenuHandler.currentMenuItems = menuItems;
  MenuHandler.displayMenuItem();
}

MenuHandler.loadParentContent = function() {

  var parent = MenuHandler.menuStack.pop();

  // this means we have to load the main menu
  if (MenuHandler.menuStack.length < 1) {
    MenuTools.loadMainMenu(parent.id);
    return;
  }

  var parentParent = MenuHandler.menuStack[MenuHandler.menuStack.length - 1];
  parentParent.loadSubMenuItems(parent.id);
}

MenuHandler.displayMenuItem = function() {
  var itemToDisplay = MenuHandler.getCurrentMenuItem();
  itemToDisplay.displayContent();
}

MenuHandler.getCurrentMenuItem = function() {
  return MenuHandler.currentMenuItems[MenuHandler.currentMenuIdx];
}

MenuHandler.displayNextItem = function(nextItem) {
  var drawNewMenuItem = MenuHandler.setNextMenuItemIdx(nextItem);
  //if (drawNewMenuItem == true) {
  MenuHandler.displayMenuItem();
  //	}
}

MenuHandler.setNextMenuItemIdx = function(nextItem) {
  if (MenuHandler.currentMenuItems.length <= 1) {
    return false;
  }

  if (nextItem == true) {
    MenuHandler.currentMenuIdx++;
    if (MenuHandler.currentMenuIdx == MenuHandler.currentMenuItems.length) {
      MenuHandler.currentMenuIdx = 0;
    }
  } else {
    MenuHandler.currentMenuIdx--;
    if (MenuHandler.currentMenuIdx < 0) {
      MenuHandler.currentMenuIdx = MenuHandler.currentMenuItems.length - 1;
    }
  }

  return true;
}
