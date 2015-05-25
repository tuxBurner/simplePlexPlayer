var admin = {};

$(function() {
  admin.initVolSlider();
});

/*
 * Initializes the volume slider
 */
admin.initVolSlider = function() {
  $.get('/sys/volume', function(data) {
    $("#volumeCtrlVal").text(data.volume);
    $('#volumeCtrl').slider({
      "reversed": true,
      "value": data.volume,
      "min": 0,
      "max": 100,
      "step": 1,
      "orientation": "vertical"
    }).on("slide", function(slideEvt) {
      $("#volumeCtrlVal").text(slideEvt.value);
    }).on("slideStop", function(slideEvt) {
      $.get('/sys/volume/' + slideEvt.value);
    });

  });
};
