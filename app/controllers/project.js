'use strict';
var uuid = require('node-uuid');
var AccountManager = require('../lib/AccountManagerHelper');

module.exports = function (app, etcdManager) {
    var RequestHelper = require('../lib/RequestHelper');
    var reqHelper = new RequestHelper();
    /**
     * Lists all projects from a user
     * @todo Put cm in a user context
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.list = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            var userData = {
                owner: req.user.emails[0].value,
            }
            try {
                // Discovers with etcdManager the ACCM URL
                var accmURL = etcdManager.getACCMUrl();
                var accm = new AccountManager(accmURL);
                // Discover correct projectId
                accm.listProjects(userData).then(
                    function (projects) {
                        // Do something
                        reqHelper.createResponse(res, 200,
                            {
                                id: uuid.v4(),
                                items: projects,
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
            reqHelper.createResponse(res, 400,
                'Malformed request');
        }
    };

    return this;
};
