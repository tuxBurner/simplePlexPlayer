var MenuHandler = function() {}
MenuHandler.currentMenuItems = [];
MenuHandler.currentMenuIdx = 0;
MenuHandler.menuStack = [];

/**
 * Sets the current menu items
 */
MenuHandler.setCurrentItems = function(menuItems, pushToStack, highlightId) {
	if (menuItems.length == 0) {
		return;
	}

	// add something to the stack ??
	if (pushToStack !== undefined && pushToStack !== null) {
		MenuHandler.menuStack.push(pushToStack);
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

/**
 * This is called when the user wants to go back one menu
 */
MenuHandler.loadParentContent = function() {
	var parent = MenuHandler.menuStack.pop();
	// this means we have to load the main menu
	if (MenuHandler.menuStack.length == 0) {
		MenuTools.loadMainMenu(parent.id);
		return;
	}

	// we have to load the parent parent to higlight the parent menu entrance in it
	var parentParent = MenuHandler.menuStack.pop();
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
	MenuHandler.displayMenuItem();
}

/*
 * check if there is a next menu item in the menu
 */
MenuHandler.hasNextItem = function() {
	if (MenuHandler.currentMenuItems.length <= 1) {
		return false;
	}

	return (MenuHandler.currentMenuIdx + 1 < MenuHandler.currentMenuItems.length);
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
