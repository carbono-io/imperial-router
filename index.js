'use strict';
var consign     = require('consign');
var express     = require('express');
var config      = require('config');
var bodyParser  = require('body-parser');
var app         = express();
var baseApp     = express();

var htPort = config.get('port');

// Parse JSON data in post requests
app.use(bodyParser.json());

app.use('/imp', baseApp);
baseApp.authenticate = require('./app/authenticate').auth;

// allow cross-domain. see http://www.w3.org/TR/cors/
baseApp.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

consign({cwd: 'app'})
    .include('auth')
    .include('controllers')
    .include('routes')
    .into(baseApp);

var server = app.listen(htPort, function () {
    var host = config.get('host');
    var port = config.get('port');
    console.log('Imperial Router listening at http://%s:%s', host, port);
    require('carbono-service-manager');
});

module.exports = server;