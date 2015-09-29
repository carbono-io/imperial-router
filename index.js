'use strict';
var consign     = require('consign');
var express     = require('express');
var config      = require('config');
var bodyParser  = require('body-parser');
var app         = express();
var baseApp     = express();

var htPort = config.get('port');

var EtcdManager = require('./app/lib/etcd-manager.js');
var etcdManager = new EtcdManager();

// Parse JSON data in post requests
app.use(bodyParser.json());

app.use('/imperial', baseApp);
baseApp.authenticate = require('./app/authenticate');

consign({cwd: 'app'})
    .include('auth')
    .include('controllers')
    .include('routes')
    .into(baseApp, etcdManager);

var server = app.listen(htPort, function () {
    var host = config.get('host');
    var port = config.get('port');
    console.log('Imperial Router listening at http://%s:%s', host, port);
    etcdManager.init();
});

module.exports = server;
