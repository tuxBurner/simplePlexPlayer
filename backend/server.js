/**
* This is the server handling some stuff
*/

// require stuff
var conf = require('./config.json');

var rpiGpio = null;
if(conf.displayOnOfPin !== undefined) {
  rpiGpio = require('./rpigpio.js');
}

var sources = {};

var LocalSource = require('./LocalSource.js');
for(idx in conf.sources) {
  var sourceConf = conf.sources[idx];
   
  var source = null; 

  switch (sourceConf.type) {
    case "dir": {
      source = new LocalSource(sourceConf);
   
      break;
    }
  }

  if(source != null) {
    sources[source.conf.name] = source; 
  }
}


/**
* #### THE EXPRESS STUFF ####
*/
var express = require('express');
var app = express();

if(rpiGpio !== null) {
  app.get('/display/on', function(req, res){
    rpiGpio.turnDisplayOn(res);
  });

  app.get('/display/off', function(req, res){
    rpiGpio.turnDisplayOff(res);
  });
}

/**
* #### SOURCES ENDPOINTS ####
*/
// get the sources
app.get('/sources', function(req,res) {
  res.json(Object.keys(sources));
});

app.get('/sources/:sourceName', function(req,res) {
  if(sources[req.params.sourceName] === undefined) {
     res.status(500).send('Source '+req.params.sourceName+" not found !");
  } else {
    res.json(sources[req.params.sourceName].rootFolder);
  }
});

app.get('/sources/:sourceName/*', function(req,res) {
  if(sources[req.params.sourceName] === undefined) {
     res.status(500).send('Source '+req.params.sourceName+" not found !");
  } else {
    var pathParts = req.params[0].split('/');

    var parent = sources[req.params.sourceName].rootFolder;

    for(idx in pathParts) {
      var pathInfo = pathParts[idx];
      if(parent.subFolders[pathInfo] === undefined) {
        if(parent.audioFiles[pathInfo] === undefined) {
          res.status(500).send('Source '+pathInfo+" not found !");
        } else {
          res.sendFile(parent.audioFiles[pathInfo].path);
          return;
        }
      } else {
         parent = parent.subFolders[pathInfo];
      }
    }
    res.json(parent);
  }
});



var server = app.listen(conf.serverPort, function() {
    console.log('Listening on port %d', server.address().port);
});


/**
* #### HANDLE SHUTDOWN ####
*/
process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here

  if(rpiGpio !== null) {
    rpiGpio.close();
  }

  process.exit();

});
