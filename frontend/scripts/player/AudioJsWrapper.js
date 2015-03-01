var AudioPlayer = function() {};
AudioPlayer.audioJs;


AudioPlayer.init = function() {
	AudioPlayer.audioJs = audiojs.create(document.getElementById('audioJsAudio'), {
		trackEnded: function() {
			AudioPlayer.loadNextTrack(true, that.repeatAll);
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

var AudioJsWrapperOld = function(skipSeconds, repeatAll) {

	this.fwd = function(fwd, eventCounter) {
		var newVal = that.audioJs.element.currentTime;
		var amount = (eventCounter < that.skipSeconds.fastTrigger) ? that.skipSeconds.slow : that.skipSeconds.fast;
		if (fwd == true) {
			newVal += amount;
		} else {
			newVal -= amount;
		}

		that.audioJs.element.currentTime = newVal;
	}
}
