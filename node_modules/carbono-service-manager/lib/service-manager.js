'use strict';

var request = require('request');
var q = require('q');

var serviceManager = function(serverOrigin) {
    this.serverOrigin = serverOrigin || '127.0.0.1:4001';

    this.registerService = function (service, origin) {
        var deffered = q.defer();

        var options = {
            url: this.generateUrlForService(service),
            qs: {value: origin},
            method: 'POST'
        };

        request(options, function (err, response, body) {
            if (err) {
                deffered.reject(err);
            }

            deffered.resolve();
        });

        return deffered.promise;
    }

    this.findService = function (service) {
        var deffered = q.defer();

        var options = {
            url: this.generateUrlForService(service),
            method: 'GET'
        };

        request(options, function (err, response, body) {
            if (err) {
                deffered.reject(err);
            }

            var body = JSON.parse(body);

            if (typeof body.node != 'undefined') {
                deffered.resolve(body.node.nodes[0].value);
            } else {
                deffered.reject(body);
            }
        });

        return deffered.promise;
    }

    this.generateUrlForService = function (service) {
        return 'http://' + this.serverOrigin + '/v2/keys/backends/' + service;
    }
}

module.exports = serviceManager;
