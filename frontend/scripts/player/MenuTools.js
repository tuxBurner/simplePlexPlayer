var MenuTools = function() {}

// the main menu items
MenuTools.mainMenuItems = null;

MenuTools.handleBarTpls = {
	"menuitem": Handlebars.compile($("#menuitem-tpl").html()),
	"player": Handlebars.compile($("#player-tpl").html()),
	// templates for the options
	"options_sysinfos": Handlebars.compile($("#options_sysinfos-tpl").html()),
	"options_wifisettings": Handlebars.compile($("#options_wifisettings-tpl").html())
}


/**
 * This loads a source entrance from the backend which can contain files and dirs
 */
MenuTools.loadSourceEntrances = function(parent, highlightId) {
	var id = parent.id;
	var url = "sources/" + id.split('?').join('%3F');
	Tools.callBackend(url, function(data) {
		var menuItems = [];

		// check if we only have one audio menu
		if (data.subFolders.length == 0 && data.audioFiles.length == 1) {
			menuItems.push(new PlayerMenuItem(data.audioFiles[0], id + "/" + data.audioFiles[0].name));
			MenuHandler.setCurrentItems(menuItems, parent, highlightId);
			return;
		}

		for (idx in data.subFolders) {
			var subFolder = data.subFolders[idx];
			menuItems.push(new DirectoryMenuItem(subFolder.name, subFolder.thumb, id));
		}

		if (data.audioFiles.length > 1) {
			menuItems.push(new AudioAllFilesMenuItem(id, data.audioFiles, parent.thumb));
		}

		for (idx in data.audioFiles) {
			var audioFile = data.audioFiles[idx];
			menuItems.push(new AudioFileMenuItem(audioFile, id));
		}

		MenuHandler.setCurrentItems(menuItems, parent, highlightId);
	});
}

/**
 * Displays a simple std menuitem
 */
MenuTools.displayMenuItem = function(menuItem, menuAdditionalContent) {
	MenuTools.displayContent("menuitem", {
		"menuItem": menuItem,
		"menuStack": MenuHandler.menuStack,
		"position": MenuHandler.currentMenuIdx + 1,
		"itemsCount": MenuHandler.currentMenuItems.length,
		"menuAdditionalContent": menuAdditionalContent
	});
}

MenuTools.displayContent = function(tplName, data, callBack) {
	var currentBg = $('#menuItem').css('background-image');
	$('#menuItem').removeClass();

	var content = MenuTools.handleBarTpls[tplName](data);
	$('#menuItem').html(content);
	$('#menuItem').addClass(data.menuItem.cssClass);

	if (data.menuItem.thumb !== undefined) {
		var newBg = 'url(' + data.menuItem.thumb + ')';
		if (currentBg !== newBg) {
			$('#menuItem').css('background-image', newBg);
		}
	} else {
		$('#menuItem').css('background-image', 'none');
	}

}

MenuTools.loadMainMenu = function(hilightId) {

	if (MenuTools.mainMenuItems == null) {

		MenuTools.mainMenuItems = [];
		// load all the sources from the backend
		Tools.callBackend("sources", function(data) {
			for (idx in data) {
				var source = data[idx];
				MenuTools.mainMenuItems.push(new SourceMenuItem(source));
			}

			// finaly add the options main menu
			MenuTools.mainMenuItems.push(new OptionMainMenuItem());
			MenuHandler.setCurrentItems(MenuTools.mainMenuItems);

		});
	} else {
		MenuHandler.setCurrentItems(MenuTools.mainMenuItems, null, hilightId);
	}
}
