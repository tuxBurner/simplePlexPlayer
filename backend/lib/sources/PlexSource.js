// see https://docs.google.com/document/d/19bTQr99oKn2pOpHcVtqidokbq9zup-K-mFy8JmII6uQ/edit

var Folder = require('./../Folder.js');
var AudioFile = require('./../AudioFile.js');
var PlexAPI = require("plex-api");

/**
 * Reads the data from a plex server
 */
function PlexSource(conf) {
	var that = this;
	this.conf = conf;
	this.client = new PlexAPI(conf.server);
	this.plexHttpUrl = "http://" + conf.server + ":" + conf.port;

	this.rootFolder = new Folder(conf.name);

	this.loadData = function() {
		that.queryPlex("/library/sections/" + conf.section + "/all", that.rootFolder);
	}

	this.queryPlex = function(queryUrl, parentFolder, callBack) {
		that.client.find(queryUrl).then(function(entries) {
			for (idx in entries) {
				var entry = entries[idx];
				switch (entry.attributes.type) {
					case "album":
					case "artist":
						that.creatFolderFromEntry(entry, parentFolder);
						break;
					case "track":
						that.addAudioToFolder(entry, parentFolder);
						break;
					default:
						break;
				}
			}

			if (callBack !== undefined) {
				callBack();
			}
		}, function(err) {
			throw new Error("Could not connect to server");
		});
	}

	this.addAudioToFolder = function(entry, folder) {
		if (entry.media !== undefined) {
			var media = entry.media[0];
			if (media.attributes.audioCodec != 'mp3') {
				return;
			}
			var part = media.part[0]
			var path = that.plexHttpUrl + part.attributes.key;
			var title = entry.attributes.title.replace('/', '-');
			var audioFile = new AudioFile(title, path, folder.thumb, part.attributes.duration);
			audioFile.stream = true;
			folder.addFile(audioFile);
		}
	}

	this.creatFolderFromEntry = function(entry, parentFolder) {
		var title = entry.attributes.title.replace('/', '-');
		if (parentFolder.subFolders[title] !== undefined) {
			title = that.findUniqueName(title, parentFolder);
		}

		var folder = null;
		if (parentFolder.subFolders[title] === undefined) {
			var thumb = (entry.attributes.thumb !== undefined) ? that.plexHttpUrl + entry.attributes.thumb : parentFolder.thumb;

			if (thumb !== undefined) {
				thumb = that.plexHttpUrl + "/photo/:/transcode?url=" + thumb + "&width=800&height=600"
			}

			folder = new Folder(title, entry.attributes.key, thumb);
			parentFolder.addSubFolder(folder);
		} else {
			console.log("Folder:" + title + " already exists mix in sub entries");
			folder = parentFolder.subFolders[title];
		}

		// register callback when the user requests this folder and it is not loaded already
		folder.dataCallBack = function(httpRespCallback) {
			that.queryPlex(entry.attributes.key, folder, httpRespCallback)
		}

	}

	this.findUniqueName = function(title, parentFolder) {
		var pref = 1;
		do {
			var newTitle = title + '_' + pref;
			if (parentFolder.subFolders[newTitle] === undefined) {
				return newTitle;
			}
			pref++;
		} while (true);
	}


	// when constructed start loading the data from the backend
	that.loadData();
}


module.exports = PlexSource;
