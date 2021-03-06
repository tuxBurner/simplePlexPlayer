/**
 * This is the server handling some stuff
 */
// require stuff
var conf = require('./config.json');

var rpiGpio = null;
if (conf.displayOnOfPin !== undefined) {
  try {
    var RpiGpio = require('./lib/RpiGpio.js');
    rpiGpio = new RpiGpio(conf);
  } catch (ex) {
    console.error(ex);
  }
}

var sources = {};

var LocalSource = require('./lib/sources/LocalSource.js');
var PlexSource = require('./lib/sources/PlexSource.js');
var RadioSource = require('./lib/sources/RadioSource.js');

// load all sources and instanstiate them
for (var idx in conf.sources) {
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

  if (source !== null) {
    sources[source.conf.name] = source;
  }
}


/**
 * #### THE EXPRESS STUFF ####
 */
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var path = require('path');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname + '/views/public')));

/**
 * #### ADMIN PANEL ####
 */
app.get('/', function(req, res) {
  res.render('index');
});
/**
 * #### EO ADMIN PANEL ####
 */



/**
 * #### DISPLAY ON / OFF ####
 */
// only expose gpio stuff when having gpio
app.get('/display/on', function(req, res) {
  if (rpiGpio !== null) {
    rpiGpio.turnDisplayOn(res);
    return;
  }
  res.send("OK");
});

app.get('/display/off', function(req, res) {
  if (rpiGpio !== null) {
    rpiGpio.turnDisplayOff(res);
    return;
  }
  res.send("OK");
});
/**
 * #### EO DISPLAY ON / OFF ####
 */



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

    for (var idx in pathParts) {
      var pathInfo = pathParts[idx];
      if (parent.subFolders[pathInfo] === undefined) {
        if (parent.audioFiles[pathInfo] === undefined) {
          res.status(500).send('Source ' + pathInfo + " not found !");
        } else {
          var file = parent.audioFiles[pathInfo];
          if (file.stream === false) {
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

app.get('/file/*', function(req, res) {
  var path = req.params[0];
  if (fs.existsSync(path) === false) {
    res.status(500).send("Local file: " + path + " does not exist");
  } else {
    res.sendFile(path);
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
      if (details.family === 'IPv4' && details.internal === false) {
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
};

/**
 * collects all the sysinfos
 */
var gatherSysInfos = function() {

  // check if is in ap mode or not
  var inApMode = fs.existsSync('./network/apMode');


  var data = fs.readFileSync('./network/networkConf.json', 'utf8');
  var netCfg = JSON.parse(data);

  var sysInfos = {
    "ifaces": gatherNetDevInfos(),
    "netCfg": netCfg,
    "inApMode": inApMode.toString()
  };

  return sysInfos;
};

/**
 * Gather the sys informations
 */
app.get('/sys/infos', function(req, res) {
  res.jsonp(gatherSysInfos());
});

var fs = require('fs');
var exec = require('child_process').exec;

/**
 * writes the network conf
 */
app.get('/sys/network/config', function(req, res) {
  fs.readFile('./network/networkConf.tpl', 'utf8', function(err, data) {
    // replace the place holders
    var result = data.replace('<ssidGoesHere>', req.query.ssid);
    result = result.replace('<wpaGoesHere>', req.query.wpa);

    var cfg = {
      "ssid": req.query.ssid,
      "wpa": req.query.wpa
    };

    fs.writeFile('./network/networkConf.json', JSON.stringify(cfg), function(err) {
      // write the file
      fs.writeFile('./network/networkConf.cfg', result, function(err) {
        if (!err) {
          execStopApMode(res);
        }
      });
    });
  });
});

/**
 * Starts the ap mode
 */
app.get('/sys/network/apMode/start', function(req, res) {
  execStartApMode(res);
});

/**
 * Stops the ap mode
 */
app.get('/sys/network/apMode/stop', function(req, res) {
  execStopApMode(res);
});

/**
 * Switch the ap mode
 */
app.get('/sys/network/apMode/switch', function(req, res) {
  var inApMode = fs.existsSync('./network/apMode');
  if (inApMode === true) {
    execStopApMode(res);
  } else {
    execStartApMode(res);
  }
});



/**
 * #### VOLUME STUFF ####
 */
// controlls the loudness
var loudness = require('loudness');
/**
 * Endpoint for reading the volume
 */
app.get('/sys/volume', function(req, res) {
  loudness.getVolume(function(err, vol) {
    res.jsonp({
      "volume": vol
    });
  });
});

/**
 * Endpoint for setting the volume
 */
app.get('/sys/volume/:vol', function(req, res) {
  var vol = req.params.vol;
  if (vol < 0) {
    vol = 0;
  }
  if (vol > 100) {
    vol = 100;
  }
  loudness.setVolume(vol, function(err) {
    res.jsonp({
      "loudness": vol
    });
  });
});
/**
 * #### EO VOLUME STUFF ####
 */



/**
 * Stops the ap mode of the machine and starts normal networking
 * @param res
 */
var execStopApMode = function(res) {
  exec("./network/stopApMode.sh " + conf.networkCfgFile, function(error, stdout, stderr) {
    res.jsonp({
      "status": "okay"
    });
  });
};

/**
 * Stops the ap mode of the machine and starts normal networking
 * @param res
 */
var execStartApMode = function(res) {
  exec("./network/startApMode.sh " + conf.networkCfgFile, function(error, stdout, stderr) {
    res.jsonp({
      "status": "okay"
    });
  });
};

/**
 * This can be called to press a key in x
 */
app.get('/sys/key/:key', function(req, res) {
  pressKeyInX(req.params.key, res);
});

/**
 * Presses the given key in the x window
 * @param key
 */
var pressKeyInX = function(key, res) {
  exec('./pressXKey.sh ' + key, function(error, stdout, stderr) {
    res.jsonp({
      "status": "okay"
    });
  });
};

/**
 * Restarts the system
 */
app.get('/sys/restart', function(req, res) {
  exec(conf.restartCmd, function(error, stdout, stderr) {
    res.jsonp({
      "status": "okay"
    });
  });
});

/**
 * Shutdown the system
 */
app.get('/sys/shutdown', function(req, res) {
  exec(conf.shutdownCmd, function(error, stdout, stderr) {
    res.jsonp({
      "status": "okay"
    });
  });
});


// start the server
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
