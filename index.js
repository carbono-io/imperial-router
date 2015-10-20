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