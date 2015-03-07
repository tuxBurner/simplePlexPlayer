/**
 * The sys info options menu item
 */
var OptionSysInfoMenuItem = function() {

  var that = this;

  this.title = 'System Info';
  this.id = 'options_sysinfos';
  this.cssClass = 'options';

  this.performAction = function() {
    return;
  }

  this.displayContent = function() {
    Tools.callBackend(Config.baseUrl + '/sys/infos', function(data) {
      var sysInfoContent = MenuTools.handleBarTpls['options_sysinfos']({
        "data": data
      });
      MenuTools.displayMenuItem(that, sysInfoContent);
    });
  }
}
OptionSysInfoMenuItem.prototype = new MenuItem;
