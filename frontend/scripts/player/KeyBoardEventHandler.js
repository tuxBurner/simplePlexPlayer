var KeyBoardEventHandler = function(player) {

	this.keyMapping = Config.keyMapping;

	this.actionDown = false;
	this.backDown = false;
	this.player = player;



	var that = this;

	$(document).bind('keydown', function(e) {
		that.handleKeyDown(e);
	});

	$(document).bind('keyup', function(e) {
		that.handleKeyUp(e);
	});

	/**
	 * handle key pressed down
	 */
	this.handleKeyDown = function(e) {
		// display off well pushing any button just turns it on nothing else
		if (that.player.displayOff == true) {
			that.player.startTimeOut();
			return;
		}

		var pageBlocked = $(window).data("blockUI.isBlocked");
		if (pageBlocked === 1) {
			return;
		}

		var actionToPerform = "none";
		switch (e.which) {
			case that.keyMapping.left:
				actionToPerform = "left"
				break;
			case that.keyMapping.right:
				actionToPerform = "right"
				break;
			case that.keyMapping.back:
				actionToPerform = "back"
				this.backDown = true;
				break;
			case that.keyMapping.action:
				actionToPerform = "action"
				this.actionDown = true;
				break;
		}

		if (this.actionDown == true && this.backDown == true) {
			window.location.reload();
			Tools.blockUI();
			return;
		}

		var currentMenuItem = MenuHandler.getCurrentMenuItem();
		currentMenuItem.handleKeyEventDown(actionToPerform);
	}

	/**
	 * handle key pressed up
	 */
	this.handleKeyUp = function(e) {
		// display off well pushing any button just turns it on nothing else
		if (that.player.displayOff == true) {
			that.player.startTimeOut();
			return;
		}

		var pageBlocked = $(window).data("blockUI.isBlocked");
		if (pageBlocked === 1) {
			return;
		}

		var actionToPerform = "none";
		switch (e.which) {
			case that.keyMapping.left:
				actionToPerform = "left"
				break;
			case that.keyMapping.right:
				actionToPerform = "right"
				break;
			case that.keyMapping.back:
				actionToPerform = "back"
				this.backDown = false;
				break;
			case that.keyMapping.action:
				actionToPerform = "action"
				this.actionDown = false;
				break;
		}

		var currentMenuItem = MenuHandler.getCurrentMenuItem();
		if (currentMenuItem !== undefined) {
			currentMenuItem.handleKeyEvent(actionToPerform);
		}
	}
}
