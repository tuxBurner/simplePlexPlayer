/**
 * The menu where you can change the wifi settings
 */
var OptionWifiSettingsMenuItem = function() {

	var that = this;

	this.title = 'Display Wifi Settings';
	this.id = 'options_wifisettings';

	this.performAction = function() {
		return;
	}


	this.handleKeyEvent = function(actionType) {
		if (actionType == "action") {
			var elemId = $(document.activeElement).attr('id');

			// submit the data to the backend
			if (elemId == 'options_wifisettings_submit') {
				var ssid = $('#options_wifisettings_essid').val();
				var wpa = $('#options_wifisettings_wpa').val();

				var url = '/sys/network/config?wpa=' + wpa + '&ssid=' + ssid;

				Tools.callBackend(Config.baseUrl + url, function(data) {
					MenuHandler.loadParentContent();
				});
				return;
			}

			// switch the mode of the ap
			if (elemId == 'options_wifisettings_switchapmode') {
				Tools.callBackend(Config.baseUrl + '/sys/network/apMode/switch',
					function(data) {
						window.location.reload();
					});
				return;
			}

			if (elemId == 'options_wifisettings_cancel') {
				MenuHandler.loadParentContent();
				return;
			}
		}

		// set the focus on the next input when back action is hit
		if (actionType == "back") {
			Tools.nextOnTabIndex($(document.activeElement)).focus();
			return;
		}
	}

	this.displayContent = function() {
		Tools.callBackend(Config.baseUrl + '/sys/infos', function(data) {
			MenuTools.displayContent('options_wrapper', {
				"title": that.title,
				"menuStack": MenuHandler.menuStack,
				"position": MenuHandler.currentMenuIdx + 1,
				"itemsCount": MenuHandler.currentMenuItems.length,
				"optionsContent": MenuTools.handleBarTpls['options_wifisettings']({
					"data": data
				})
			});
			var simpleScreenOptions = {
				"keys": {
					39: "nextChar",
					37: "prevChar",
					27: "cancle",
					13: "enter"
				}
			}
			$('#options_wifisettings_essid').simpleOnScreenKeyb(simpleScreenOptions);
			$('#options_wifisettings_wpa').simpleOnScreenKeyb(simpleScreenOptions);
			Tools.nextOnTabIndex($(document.activeElement)).focus();
		});
	}
}
OptionWifiSettingsMenuItem.prototype = new MenuItem;
