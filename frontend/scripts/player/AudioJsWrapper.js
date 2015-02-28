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

AudioPlayer.loadTrack = function(streamUrl, startPlaying) {
	//var trackSrc = $('#playList li.playing').attr('data-src');
	AudioPlayer.audioJs.load(streamUrl);
	//if (startPlaying === undefined || startPlaying == true) {
	AudioPlayer.audioJs.play();
	//}
}

AudioPlayer.updatePercentage = function(percentage) {

}

AudioPlayer.stop = function() {
	if (AudioPlayer.audioJs.playing == true) {
		AudioPlayer.audioJs.pause();
	}
}

var AudioJsWrapperOld = function(skipSeconds, repeatAll) {

	this.skipSeconds = skipSeconds;

	// repeat playlist when rech end ?
	this.repeatAll = repeatAll;

	var that = this;

	// initialize the player
	this.audioJs = audiojs.create(document.getElementById('audioJsAudio'), {
		trackEnded: function() {
			that.loadNextTrack(true, that.repeatAll);
		},
		updatePlayhead: function(percentage) {
			that.updatePercentage(percentage);
		}
	});

	this.total = undefined;

	this.loadTrack = function(startPlaying) {
		var trackSrc = $('#playList li.playing').attr('data-src');
		this.audioJs.load(trackSrc);
		if (startPlaying === undefined || startPlaying == true) {
			this.audioJs.play();
		}
	}

	this.loadNextTrack = function(nextTitle, repeatOnEnd) {
		var next = null;

		var playNextTrack = true;

		var scrollPos = $('#playListWrapper').data("scrollpos");
		var scrollOffset = 0;

		if (nextTitle == true) {
			next = $('#playList li.playing').next();
			if (next.length == 0) {
				next = $('#playList li').first();
				scrollPos = 0;
				// prevent of restarting the playlist when reached the end and settings are setted
				if (repeatOnEnd !== undefined && repeatOnEnd == false) {
					playNextTrack = false;
				}
			} else {
				scrollPos += $(next).outerHeight(true);
			}
		} else {
			next = $('#playList li.playing').prev();
			if (next.length == 0) {
				next = $('#playList li').last();
				scrollPos = $('#playList').height() - $(next).outerHeight(true);
			} else {
				scrollPos -= $('#playList li.playing').outerHeight(true);
			}
		}

		// hide all progress bars
		$('#playList li.playing .playtime').text('00:00');
		$('#playList li.playing .playprogress').css("width", "0%");
		$('#playList li.playing').removeClass('playing');
		$(next).addClass('playing');

		// scroll the container
		$('#playListWrapper').scrollTop(scrollPos)
		$('#playListWrapper').data("scrollpos", scrollPos);

		this.loadTrack(playNextTrack);
	}

	this.updatePercentage = function(percentage) {
		if ($('#playList li.playing .duration').html() == "") {
			$('#playList li.playing .duration').html(Tools.readableDuration(this.audioJs.element.duration));
		}

		var playedString = Tools.readableDuration(this.audioJs.duration * percentage);
		var percent = Math.round(percentage * 100);
		$('#playList li.playing .playprogress').css("width", percent + "%");
		$('#playList li.playing .playtime').text(playedString);
	}

	this.stop = function() {
		if (this.audioJs.playing == true) {
			this.audioJs.pause();
		}
	}

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
