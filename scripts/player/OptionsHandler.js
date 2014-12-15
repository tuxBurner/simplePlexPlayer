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
      case 'opts_wifisettings':
        that.displayWifiSettings();
        break;
    }
  }


  /**
   * This is called when the user selects wifisettings
   */
  this.displayWifiSettings = function() {
    // override the keyboard handler
    that.player.keyBoardHandler.registerOverrideHandler(
      function(e) {
        if (e.which == that.player.keyBoardHandler.keyMapping.back) {
          Tools.nextOnTabIndex($(document.activeElement)).focus();
          return;
        }
        if (e.which == that.player.keyBoardHandler.keyMapping.action) {
          var elemId = $(document.activeElement).attr('id');
          if (elemId == 'options_wifisettings_submit') {
            alert("submit data to backend");
          }
          if (elemId == 'options_wifisettings_cancel') {
            that.player.keyBoardHandler.deRegisterOverrideHandler();
            that.player.performEscAction();
          }
        }
      },
      function(e) {
        return;
      });

    that.displayOptionsTpl('/sysinfos', 'Wifi Settings', function(data) {
      var optionsContent = that.player.templates['options_wifisettings']({
        "data": data
      });
      return optionsContent;
    }, function() {
      // register keyboardhandler when the content is rendered
      var options = {
        "keys": {
          39: "nextChar",
          37: "prevChar",
          27: "cancle",
          13: "enter"
        }
      }
      $('#options_wifisettings_essid').simpleOnScreenKeyb(options);
      $('#options_wifisettings_wpa').simpleOnScreenKeyb(options);
    });

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

    that.displayOptionsTpl('/sysinfos', 'Sys Infos', function(data) {
      var optionsContent = that.player.templates['options_sysinfos']({
        "data": data
      });
      return optionsContent;
    });
  }

  /**
   * This is called whe the user wants to display an options entrance
   */
  this.displayOptionsTpl = function(url, title, optionsContentCallBack, displayCallBack) {
    Tools.callBackend(that.player.config.baseUrl + url, function(data) {
      that.player.displayContent('options_wrapper', {
        "title": title,
        "menuStack": that.player.menuHandler.menuStack,
        "optionsContent": optionsContentCallBack(data)
      }, displayCallBack);
    });

  }
}
