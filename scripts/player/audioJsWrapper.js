var AudioJsWrapper = function(skipSeconds) {

  this.skipSeconds = skipSeconds;

  var that = this;

  // initialize the player
  var audioJs = audiojs.create(document.getElementById('audioJsAudio'),{
    trackEnded: function() {
      that.loadNextTrack(true);
    },
    updatePlayhead: function(percentage) {
      that.updatePercentage(percentage);
    }
  });

  this.audioJs = audioJs;
  this.total = undefined;

  this.loadTrack =  function() {
    var trackSrc = $('#playList li.playing').attr('data-src');
    this.audioJs.load(trackSrc);
    this.audioJs.play();
  }

  this.loadNextTrack = function(nextTitle) {
    var next = null;

    var scrollPos = $('#playListWrapper').data("scrollpos");
    var scrollOffset = 0;

    if(nextTitle == true) {
      next = $('#playList li.playing').next();
      if(next.length == 0) {
        next = $('#playList li').first();
        scrollPos = 0;
      } else {
        scrollPos+=$(next).outerHeight(true);
      }
    } else {
      next = $('#playList li.playing').prev();
      if(next.length == 0) {
        next = $('#playList li').last();
        scrollPos=$('#playList').height()-$(next).outerHeight(true);
      } else {
        scrollPos-=$('#playList li.playing').outerHeight(true);
      }
    }

    // hide all progress bars
    $('#playList li.playing .playtime').text('00:00');
    $('#playList li.playing .playprogress').css("width","0%");
    $('#playList li.playing').removeClass('playing');
    $(next).addClass('playing');

    // scroll the container
    $('#playListWrapper').scrollTop(scrollPos)
    $('#playListWrapper').data("scrollpos",scrollPos);

    this.loadTrack();
  }

  this.updatePercentage = function(percentage) {
    var playedString = Tools.readableDuration(this.audioJs.duration * percentage);
    var percent = Math.round(percentage*100);
    $('#playList li.playing .playprogress').css("width",percent+"%");
    $('#playList li.playing .playtime').text(playedString);
  }

  this.stop = function() {
    if(this.audioJs.playing == true) {
      this.audioJs.pause();
    }
  }

  this.fwd = function(fwd,eventCounter) {
    var newVal = that.audioJs.element.currentTime;
    var amount = (eventCounter < that.skipSeconds.fastTrigger) ? that.skipSeconds.slow : that.skipSeconds.fast;
    if(fwd ==  true) {
      newVal+=amount;
    } else {
      newVal-=amount;
    }

    that.audioJs.element.currentTime = newVal;
  }
}
