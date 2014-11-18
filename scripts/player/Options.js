/**
 * Simple static helper for loading, handling and displaying options in the player frontend
 */
var Options = function() {}

Options.getOptionsMenuItems = function(currentMenuItemId) {
  console.error(currentMenuItemId);
}

/**
 * This is called when the user selects the display sysinfo options
 */
Options.displaySysInfos = function(url) {
  Tools.callBackend(url, function(data) {
    alert("data");
  });

}
