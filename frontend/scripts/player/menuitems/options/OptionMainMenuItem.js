/**
 * The main option menu entrance
 */
var OptionMainMenuItem = function() {
  this.title = 'Options';
  this.id = 'main_options';
  this.cssClass = "main_options";

  this.menuItems = [];
  this.menuItems.push(new OptionSysInfoMenuItem());

  var shutDownMenu = new SimpleMenuItem('main_options_shutdown', 'Shutdown', 'shutdown', {
    "performAction": function() {
      Tools.callBackend('sys/shutdown');
    }
  });
  this.menuItems.push(shutDownMenu);

  var restartMenu = new SimpleMenuItem('main_options_restart', 'Restart', 'restart', {
    "performAction": function() {
      Tools.callBackend('sys/restart');
    }
  });
  this.menuItems.push(restartMenu);



  var wifiSettings = new SimpleMenuItem('main_options_wifi', 'Wifi Settings', 'wifi_settings', {
    "loadSubMenuItems": function(highlightId) {
      MenuHandler.setCurrentItems([new OptionWifiSettingsMenuItem()], this);
    }
  });
  this.menuItems.push(wifiSettings);

  this.displayContent = function() {
    MenuTools.displayMenuItem(this);
  }

  this.performBack = function() {
    return;
  }

  this.loadSubMenuItems = function(highlightId) {
    MenuHandler.setCurrentItems(this.menuItems, this, highlightId);
  }

  this.performAction = function() {
    this.loadSubMenuItems();
  }
}
OptionMainMenuItem.prototype = new MenuItem;
