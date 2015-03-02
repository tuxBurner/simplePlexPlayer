var AudioPlayer = function() {};
AudioPlayer.audioJs;


AudioPlayer.init = function() {
	AudioPlayer.audioJs = audiojs.create(document.getElementById('audioJsAudio'), {
		trackEnded: function() {
			if (MenuHandler.hasNextItem() == true || Config.repeatAll == true) {
				AudioPlayer.stop();
				MenuHandler.displayNextItem(true);
			}
		},
		updatePlayhead: function(percentage) {
			AudioPlayer.updatePercentage(percentage);
		}
	});
}
AudioPlayer.init();



AudioPlayer.loadTrack = function(streamUrl, audioFile) {
	if (audioFile.duration !== undefined) {
		$('#playerDuration').html(Tools.readableDuration(audioFile.duration / 1000));
	}

	AudioPlayer.audioJs.load(streamUrl);
	AudioPlayer.audioJs.play();
}

AudioPlayer.updatePercentage = function(percentage) {
	if ($('#playerDuration').html() == "") {
		$('#playerDuration').html(Tools.readableDuration(AudioPlayer.audioJs.element.duration));
	}

	var playedString = Tools.readableDuration(AudioPlayer.audioJs.duration * percentage);
	$('#playerPlaytime').text(playedString);
}

AudioPlayer.stop = function() {
	if (AudioPlayer.audioJs.playing == true) {
		AudioPlayer.audioJs.pause();
	}
}

AudioPlayer.fwd = function(fwd, eventCounter) {
	var newVal = Number(AudioPlayer.audioJs.element.currentTime);
	var amount = (eventCounter < Config.skipSeconds.fastTrigger) ? Config.skipSeconds.slow : Config.skipSeconds.fast;
	if (fwd == true) {
		newVal += amount;
	} else {
		newVal -= amount;
	}
	AudioPlayer.audioJs.element.currentTime = newVal;
}
