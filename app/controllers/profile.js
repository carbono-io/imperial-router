'use strict';

var uuid = require('node-uuid');
var AccountManager = require('../lib/AccountManagerHelper');
var etcd = require('carbono-service-manager');

module.exports = function (app) {
    var RequestHelper = require('../lib/RequestHelper');
    var reqHelper = new RequestHelper();
    var accmURL = etcd.getServiceUrl('accm');
    console.log('TESTE -' + etcd);
    console.log('TESTE -' + accmURL);
    /**
     * Gets a profile from user email
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.getUser = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            var userData = {
                email: req.user.emails[0].value,
            };
            try {
                var accm = new AccountManager(accmURL);
                // Discover correct projectId
                accm.getUser(userData).then(
                    function (profile) {
                        // Do something
                        reqHelper.createResponse(res, 200,
                            {
                                id: uuid.v4(),
                                items: profile,
                            });
                    },
                    function (error) {
                        reqHelper.createResponse(res, error.code,
                            error.message);
                    }
                );
            } catch (e) {
                reqHelper.createResponse(res, 500,
                    e);
            }
        } else {
            reqHelper.createResponse(res, 403,
                'Unauthorized - User instance not found');
        }
    };

    /**
     * Create a projects
     * @param {Object} req - Request object
     * @param {string} req.body.data.items.name - The name of the project
     * @param {string} req.body.data.items.description
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.createProfile = function (req, res) {
        if (reqHelper.checkMessageStructure(req)) {
            var userData = req.body.data.items[0];
            var missingProperties =
                reqHelper.checkRequiredData(
                    userData, ['email', 'name', 'password']);

            if (missingProperties.length) {
                var errMessage = '';
                missingProperties.forEach(function (prop) {
                    errMessage += 'Malformed request: ' + prop +
                    ' is required.\n';
                });
                reqHelper.createResponse(res, 400, errMessage);
            } else {
                try {
                    console.log('ASDADASDDASDSD -' + accmURL);
                    var accm = new AccountManager(accmURL);
                    // Discover correct projectId
                    accm.createProfile(userData).then(
                        function (profile) {
                            // Do something
                            reqHelper.createResponse(res, 201,
                                {
                                    id: uuid.v4(),
                                    items: profile,
                                });
                        },
                        function (error) {
                            reqHelper.createResponse(res, error.code,
                                error.message);
                        }
                    );
                } catch (e) {
                    reqHelper.createResponse(res, 500,
                        e);
                }
            }
        } else {
            reqHelper.createResponse(res, 400,
                'Malformed request');
        }
    };

    /**
     * Gets a profile from a user id
     * @param {Object} req - Request object
     * @param {string} req.params.code - The profile id
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.getProfile = function (req, res) {
        var userData = {
            code: req.params.code,
        };
        try {
            var accm = new AccountManager(accmURL);
            // Discover correct projectId
            accm.getProfile(userData).then(
                function (profile) {
                    // Do something
                    reqHelper.createResponse(res, 200,
                        {
                            id: uuid.v4(),
                            items: profile,
                        });
                },
                function (error) {
                    reqHelper.createResponse(res, error.code,
                        error.message);
                }
            );
        } catch (e) {
            reqHelper.createResponse(res, 500,
                e);
        }
    };
    return this;
};