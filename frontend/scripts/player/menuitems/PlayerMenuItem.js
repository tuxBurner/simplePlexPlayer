var PlayerMenuItem = function(audioFile, parentId) {
	this.audioFile = audioFile;
	this.streamUrl = Config.baseUrl + '/sources/' + parentId.split('?').join('%3F');
	this.id = parentId + "_player";
	this.title = "Play: " + audioFile.name;
	this.thumb = Tools.fixStreamThumbUrl(audioFile.thumb);
	this.cssClass = "player"

	this.displayContent = function() {
		var playerContent = MenuTools.handleBarTpls['player']();
		MenuTools.displayMenuItem(this, playerContent);
		AudioPlayer.loadTrack(this.streamUrl, this.audioFile);
	}

	this.handleKeyEventDown = function(actionType, keyDownCounter) {
		if (actionType == "left") {
			AudioPlayer.fwd(false, keyDownCounter);
		}
		if (actionType == "right") {
			AudioPlayer.fwd(true, keyDownCounter);
		}
	}

	this.handleKeyEvent = function(actionType, keyWasDown) {
		if (actionType == "left") {
			if (keyWasDown == false && MenuHandler.currentMenuItems.length > 1) {
				MenuHandler.displayNextItem(false);
			}
		}
		if (actionType == "right") {
			if (keyWasDown == false && MenuHandler.currentMenuItems.length > 1) {
				MenuHandler.displayNextItem(true);
			}
		}
		if (actionType == "action") {
			if (AudioPlayer.audioJs.playing == true) {
				$('#playerPlayStatus').removeClass("fa-play").addClass("fa-pause");
			} else {
				$('#playerPlayStatus').removeClass("fa-pause").addClass("fa-play");
			}
			AudioPlayer.audioJs.playPause();
		}

		if (actionType == "back") {
			$('#playerDuration').text("");
			$('#playerPlaytime').text('00:00');

			AudioPlayer.stop();
			this.performBack();

		}
	}


}
PlayerMenuItem.prototype = new MenuItem;
