var PlayerMenuItem = function(audioFile, parentId) {
  this.audioFile = audioFile;
  this.streamUrl = Config.baseUrl + '/sources/' + parentId.split('?').join('%3F');
  this.id = parentId + "_player";
  this.title = "Play: " + audioFile.name;
  this.thumb = audioFile.thumb;

  this.displayContent = function() {
    MenuTools.displayContent("player", {
      "menuItem": this,
      "menuStack": MenuHandler.menuStack,
      "position": MenuHandler.currentMenuIdx + 1,
      "itemsCount": MenuHandler.currentMenuItems.length
    });

    AudioPlayer.loadTrack(this.streamUrl, this.audioFile);
  }

  this.handleKeyEvent = function(actionType) {
    if (actionType == "left") {
      // todo fwwd
      MenuHandler.displayNextItem(false);
    }
    if (actionType == "right") {
      // todo bkwd
      MenuHandler.displayNextItem(true);
    }
    if (actionType == "action") {
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
