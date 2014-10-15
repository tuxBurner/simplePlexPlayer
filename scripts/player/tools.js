var Tools =  function() {}
Tools.readableDuration = function(duration) {
  var m = Math.floor(duration / 60);
  var s = Math.floor(duration % 60);
  return ((m<10?'0':'')+m+':'+(s<10?'0':'')+s);
}

/**
* Helper for calling the backend via ajax
*/
Tools.callBackend = function(url, callback) {

  $.blockUI({
    "message": '<h1><i class="fa fa-spinner fa-spin"></i> Just a moment...</h1>',
     "ignoreIfBlocked": true  
  });

  $.ajax({
    type: 'GET',
    url: url,
    cache: false,
    crossDomain: true,
    dataType: "jsonp",
    timeout: 1500,
    success: function(data, textStatus, XMLHttpRequest) {
      $.unblockUI();
      callback(data);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      setTimeout(function() {Tools.callBackend(url,callback)},3000);
    }
  });
}
