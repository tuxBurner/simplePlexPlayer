/**
 * Simple  helper for loading, handling and displaying options in the player frontend
 */
var OptionsHandler = function(player) {

  this.player = player;
  that = this;

  /**
   * displays the current menu item
   */
  this.getOptionsMenuItems = function(currentMenuItemId) {
    switch (currentMenuItemId) {
      case 'opts_sysInfos':
        that.displaySysInfos();
        break;
    }
  }

  /**
   * This is called when the user selects the display sysinfo options
   */
  this.displaySysInfos = function() {

    that.player.keyBoardHandler.registerOverrideHandler(
      function(e) {
        if (e.which == that.player.keyBoardHandler.keyMapping.back) {
          that.player.keyBoardHandler.deRegisterOverrideHandler();
          that.player.performEscAction();
        }
      },
      function(e) {
        return;
      });

    that.displayOptionsTpl('/sysinfos', function(data) {
      var optionsContent = that.player.templates['options_sysinfos']({
        "data": data
      });
      return optionsContent;
    });
  }

  /**
   * This is called whe the user wants to display an options entrance
   */
  this.displayOptionsTpl = function(url, optionsContentCallBack) {
    Tools.callBackend(that.player.config.baseUrl + url, function(data) {
      that.player.displayContent('options_wrapper', {
        "title": "Sys Infos",
        "menuStack": that.player.menuHandler.menuStack,
        "optionsContent": optionsContentCallBack(data)
      });
    });

  }
}
