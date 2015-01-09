/**
 * This is the server handling some stuff
 */
// require stuff
var conf = require('./config.json');

var rpiGpio = null;
if (conf.displayOnOfPin !== undefined) {
  var RpiGpio = require('./RpiGpio.js');
  rpiGpio = new RpiGpio(conf);
}

var sources = {};

var LocalSource = require('./LocalSource.js');
var PlexSource = require('./PlexSource.js');
var RadioSource = require('./RadioSource.js');

// load all sources and instanstiate them
for (idx in conf.sources) {
  var sourceConf = conf.sources[idx];

  var source = null;

  switch (sourceConf.type) {
    case "dir":
      {
        source = new LocalSource(sourceConf);
        break;
      }
    case "plex":
      {
        source = new PlexSource(sourceConf);
        break;
      }
    case "radio":
      {
        source = new RadioSource(sourceConf);
        break;
      }
  }

  if (source != null) {
    sources[source.conf.name] = source;
  }
}


/**
 * #### THE EXPRESS STUFF ####
 */
var express = require('express');
var app = express();

// only expose gpio stuff when having gpio
if (rpiGpio !== null) {
  app.get('/display/on', function(req, res) {
    rpiGpio.turnDisplayOn(res);
  });

  app.get('/display/off', function(req, res) {
    rpiGpio.turnDisplayOff(res);
  });
}

/**
 * #### SOURCES ENDPOINTS ####
 */
// get the sources
app.get('/sources', function(req, res) {
  res.jsonp(Object.keys(sources));
});

app.get('/sources/:sourceName', function(req, res) {
  if (sources[req.params.sourceName] === undefined) {
    res.status(500).send('Source ' + req.params.sourceName + " not found !");
  } else {
    res.jsonp(sources[req.params.sourceName].rootFolder);
  }
});

app.get('/sources/:sourceName/*', function(req, res) {
  if (sources[req.params.sourceName] === undefined) {
    res.status(500).send('Source ' + req.params.sourceName + " not found !");
  } else {
    var pathParts = req.params[0].split('/');

    var parent = sources[req.params.sourceName].rootFolder;

    for (idx in pathParts) {
      var pathInfo = pathParts[idx];
      if (parent.subFolders[pathInfo] === undefined) {
        if (parent.audioFiles[pathInfo] === undefined) {
          res.status(500).send('Source ' + pathInfo + " not found !");
        } else {
          var file = parent.audioFiles[pathInfo];
          if (file.stream == false) {
            res.sendFile(file.path);
            return;
          } else {
            res.redirect(file.path);
            return;
          }
        }
      } else {
        parent = parent.subFolders[pathInfo];
      }
    }

    parent.loadSubData(function() {
      res.jsonp(parent);
    });

  }
});


/**
 * #### NETWORK STUFF ####
 */
var os = require('os');

/**
 * Gather the network infos
 */
var gatherNetDevInfos = function() {
  var ifaces = os.networkInterfaces();
  var iDevs = [];
  for (var dev in ifaces) {
    var alias = 0;
    ifaces[dev].forEach(function(details) {
      if (details.family == 'IPv4' && details.internal == false) {
        var devName = dev + (alias ? ':' + alias : '');
        iDevs.push({
          "name": devName,
          "details": details
        });
        ++alias;
      }
    });
  }
  return iDevs;
}

/**
 * collects all the sysinfos
 */
var gatherSysInfos = function() {
  var sysInfos = {
    "ifaces": gatherNetDevInfos()
  };

  return sysInfos;
}

app.get('/sysinfos', function(req, res) {
  res.jsonp(gatherSysInfos());
});

var fs = require('fs');
var exec = require('child_process').exec;

/**
 * writes the network conf
 */
app.get('/sysinfos/network/config',function(req,res) {
  fs.readFile('./network/networkConf.tpl', 'utf8', function (err,data) {
    // replace the place holders
    var result = data.replace('<ssidGoesHere>',req.query.ssid);
    result = result.replace('<wpaGoesHere>',req.query.wpa);
    // write the file
    fs.writeFile('./network/networkConf.cfg', result, function(err) {
      if(!err) {
        execStopApMode(res);
      }
    });
  });
});

/**
 * Starts the ap mode
 */
app.get('/sysinfos/network/startApMode', function(req,res) {
  execStartApMode(res);
});

/**
 * Stops the ap mode
 */
app.get('/sysinfos/network/stopApMode', function(req,res) {
  execStopApMode(res);
});

/**
 * Stops the ap mode of the machine and starts normal networking
 * @param res
 */
var execStopApMode = function(res) {
  exec("./network/stopApMode.sh "+conf.networkCfgFile, function (error, stdout, stderr) {
    res.send("okay");
  });
};


/**
 * Stops the ap mode of the machine and starts normal networking
 * @param res
 */
var execStartApMode = function(res) {
  exec("./network/startApMode.sh "+conf.networkCfgFile, function (error, stdout, stderr) {
    res.send("okay");
  });
};


var server = app.listen(conf.serverPort, function() {
  console.log('Listening on port %d', server.address().port);
});


/**
 * #### HANDLE SHUTDOWN ####
 */
process.on('SIGINT', function() {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here

  if (rpiGpio !== null) {
    rpiGpio.close();
  } else {
    process.exit();
  }
});
