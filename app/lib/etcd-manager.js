'use strict';
var config          = require('config');
var ServiceManager  = require('carbono-service-manager');
require('colors');

var IMP_SERVICE_KEY = 'imp';
var ACCM_SERVICE_KEY = 'accm';
var AUTH_SERVICE_KEY = 'auth';

var accmURL         = null;
var authURL         = null;
var serviceManager  = null;
var registered      = false;

/**
 * This class acts as a 'wrapper' for carbono-service-manager module, which is
 * responsible to register and find services.
 *
 * @class EtcdManager
 */
var EtcdManager = function () {
    return this;
};

/**
 * Initialize the communication with etcd. An environment variable named
 * ETCD_SERVER must exist, with a URL location to access etcd.
 *
 * @function
 */
EtcdManager.prototype.init = function () {
    if (typeof process.env.ETCD_SERVER === 'undefined') {
        console.log('The environment variable ETCD_SERVER is not defined!'
            .bold.red);
        console.log('Please, define it before continuing, otherwise the'
            .red);
        console.log('integration will not work!'.red);
        console.log();
    } else {
        serviceManager = new ServiceManager(process.env.ETCD_SERVER);

        this.findACCM();
        this.findAuthServer();
        this.register();
    }
};

/**
 * Try to register this service as a Imperial Router service ('imp'). It
 * uses the config file to determine the correct URL to access this service.
 *
 * @function
 */
EtcdManager.prototype.register = function () {
    if (serviceManager) {
        var promise = serviceManager.registerService(
            IMP_SERVICE_KEY,
            config.get('host') + ':' + config.get('port') + '/' +
            config.get('basePath')
        );

        promise.then(
            function () {
                console.log('Imperial Router registered with etcd'.green);
                registered = true;
            }, function (err) {
                console.log('[ERROR] Registering with etcd: '.red +
                    JSON.stringify(err));
                registered = false;
            });
    }
};

/**
 * (Internal) Helper function to find specifics services in Etcd Manager
 *
 * @param serviceKey  The Key to be found in the Etdc Manager
 * @param serviceName Friendly name to the service, only useful for logging
 * @param _cb         Callback function which will receive the service URL
 */
function serviceFinder(serviceKey, serviceName, _cb) {
    serviceName = serviceName || serviceKey;
    if (serviceManager) {
        var promise = serviceManager.findService(serviceKey);

        promise.then(
            function (url) {
                var msg = serviceName + 'found at etcd';
                console.log(msg.green);
                _cb(url);
            }, function (err) {
                var msg = '[ERROR] Finding ' + serviceName + ' with etcd: ';
                console.log(msg.red + JSON.stringify(err));
                _cb(null);
            });
    } else {
        _cb(null);
    }
}

EtcdManager.prototype.findACCM = function () {
    serviceFinder(ACCM_SERVICE_KEY, 'Account Manager ', function (url) {
        accmURL = url;
    });
};

/**
 * Try to find the carbono-auth host ('auth'). It saves the URL at this.authURL.
 */
EtcdManager.prototype.findAuthServer = function () {
    serviceFinder(AUTH_SERVICE_KEY, 'carbono-auth', function (url) {
        authURL = url;
    });
};

/**
 * Try to get accm server url retrieved by etcd.
 *
 * @return {string} accmURL A url to access the account-manager address
 */
EtcdManager.prototype.getACCMUrl = function () {
    return accmURL;
};

/**
 * Try to get auth server url retrieved by etcd.
 *
 * @return {string} authURL A url to access the carbono-auth address
 */
EtcdManager.prototype.getAuthUrl = function () {
    return authURL;
};

module.exports = EtcdManager;
