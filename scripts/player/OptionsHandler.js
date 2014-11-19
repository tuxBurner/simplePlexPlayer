/**
 * Simple  helper for loading, handling and displaying options in the player frontend
 */
var OptionsHandler = function(player) {

  this.player = player;
  that = this;

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
  this.displaySysInfos = function(url) {
    Tools.callBackend(that.player.config.baseUrl + '/sysinfos', function(data) {

      that.player.displayContent('options_wrapper', {
        "sysInfo": data,
        "title": "Sys Infos",
        "menuStack": that.player.menuHandler.menuStack
      });
    });

  }
}
