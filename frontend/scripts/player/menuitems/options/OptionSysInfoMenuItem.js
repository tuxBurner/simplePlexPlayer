/**
 * The sys info options menu item
 */
var OptionSysInfoMenuItem = function() {

	var that = this;

	this.title = 'System Info';
	this.id = 'options_sysinfos';

	this.performAction = function() {
		return;
	}

	this.displayContent = function() {
		Tools.callBackend(Config.baseUrl + '/sys/infos', function(data) {
			MenuTools.displayContent('options_wrapper', {
				"title": that.title,
				"menuStack": MenuHandler.menuStack,
				"position": MenuHandler.currentMenuIdx + 1,
				"itemsCount": MenuHandler.currentMenuItems.length,
				"optionsContent": MenuTools.handleBarTpls['options_sysinfos']({
					"data": data
				})
			});
		});
	}
}
OptionSysInfoMenuItem.prototype = new MenuItem;
