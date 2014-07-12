'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
	 pureautoinc = require('mongoose-pureautoinc');

var app = module.exports = exports.app = express();

app.locals.siteName = "slushtest";

// Connect to database
var db = require('./config/db');
pureautoinc.init(db.mongoose.connections[0]);
app.use(express.static(__dirname + '/public'));


// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

if ('development' == env) {
    app.use(morgan('dev'));
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        pretty: true
    });
}

if ('test' == env) {
    port = 9997;
    app.use(morgan('test'));
    app.set('view options', {
        pretty: true
    });
    app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
    }));
}

if ('production' == env) {
    app.use(morgan());
     app.use(errorhandler({
        dumpExceptions: false,
        showStack: false
    }));
}

var multer = require('multer');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(methodOverride());
app.use(multer({ dest: './public/uploads/'}))
app.use(require('body-parser')());

// Bootstrap routes/api
var routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(function(file) {
  require(routesPath + '/' + file)(app);
});

// Start server
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});