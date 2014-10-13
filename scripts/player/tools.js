var Tools =  function() {}
Tools.readableDuration = function(duration) {
  var m = Math.floor(duration / 60);
  var s = Math.floor(duration % 60);
  return ((m<10?'0':'')+m+':'+(s<10?'0':'')+s);
}

Tools.callBackend = function(url, callback) {
  $.get(url,function(data) {
      callback(data);
    },'jsonp')
    .fail(function() {
      alert("error");
    });
}
