'use strict';
var uuid = require('node-uuid');
var AccountManager = require('../lib/AccountManagerHelper');

module.exports = function (app, etcdManager) {
    var RequestHelper = require('../lib/RequestHelper');
    var reqHelper = new RequestHelper();
    /**
     * Lists all projects from a user
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
                'Malformed request - User instance not found');
        }
    };
    
    /**
     * Create a projects
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {string} req.body.data.items.name - The name of the project
     * @param {string} req.body.data.items.description
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.create = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            if (reqHelper.checkMessageStructure(req)) {
                var userData = req.body.data.items[0];
                userData.owner = req.user.emails[0].value;
                var missingProperties =
                    reqHelper.checkRequiredData(
                        userData, ['owner', 'name', 'description']);
    
                if (missingProperties.length) {
                    var errMessage = '';
                    missingProperties.forEach(function (prop) {
                        errMessage += 'Malformed request: ' + prop +
                        ' is required.\n';
                    });
                    reqHelper.createResponse(res, 400, errMessage);
                } else {
                    try {
                        // Discovers with etcdManager the ACCM URL
                        var accmURL = etcdManager.getACCMUrl();
                        var accm = new AccountManager(accmURL);
                        // Discover correct projectId
                        accm.createProject(userData).then(
                            function (project) {
                                // Do something
                                reqHelper.createResponse(res, 201,
                                    {
                                        id: uuid.v4(),
                                        items: project,
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
        } else {
            reqHelper.createResponse(res, 400,
                'Malformed request - User instace not found');
        }
    };
    
    /**
     * Gets a project from a user
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {string} req.params.code - The project id
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.get = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            var userData = {
                owner: req.user.emails[0].value,
                code: req.params.code,
            }
            try {
                // Discovers with etcdManager the ACCM URL
                var accmURL = etcdManager.getACCMUrl();
                var accm = new AccountManager(accmURL);
                // Discover correct projectId
                accm.getProject(userData).then(
                    function (project) {
                        // Do something
                        reqHelper.createResponse(res, 200,
                            {
                                id: uuid.v4(),
                                items: project,
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
                'Malformed request - User instance not found');
        }
    };
    
    /**
     * Updates a projects
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {string} req.params.code - The project id
     * @param {string} req.body.data.items.name - The name of the project
     * @param {string} req.body.data.items.description
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.update = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            if (reqHelper.checkMessageStructure(req)) {
                var userData = req.body.data.items[0];
                userData.owner = req.user.emails[0].value;
                userData.code = req.params.code;
                var missingProperties =
                    reqHelper.checkRequiredData(
                        userData, ['owner', 'name', 'description', 'code']);
    
                if (missingProperties.length) {
                    var errMessage = '';
                    missingProperties.forEach(function (prop) {
                        errMessage += 'Malformed request: ' + prop +
                        ' is required.\n';
                    });
                    reqHelper.createResponse(res, 400, errMessage);
                } else {
                    try {
                        // Discovers with etcdManager the ACCM URL
                        var accmURL = etcdManager.getACCMUrl();
                        var accm = new AccountManager(accmURL);
                        // Discover correct projectId
                        accm.updateProject(userData).then(
                            function (project) {
                                // Do something
                                reqHelper.createResponse(res, 201,
                                    {
                                        id: uuid.v4(),
                                        items: project,
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
        } else {
            reqHelper.createResponse(res, 400,
                'Malformed request - User instace not found');
        }
    };
    
    /**
     * Deletes a project from a user
     * @param {Object} req - Request object
     * @param {Object} req.user - object containing user info
     * @param {string} req.params.code - The project id
     * @param {Object} res - Response object (will carry a success or error
     * carbono-json-message)
     */
    this.delete = function (req, res) {
        if (req.user !== null && req.user && req.user.emails[0].value) {
            var userData = {
                owner: req.user.emails[0].value,
                code: req.params.code,
            }
            try {
                // Discovers with etcdManager the ACCM URL
                var accmURL = etcdManager.getACCMUrl();
                var accm = new AccountManager(accmURL);
                // Discover correct projectId
                accm.deleteProject(userData).then(
                    function (project) {
                        // Do something
                        reqHelper.createResponse(res, 200,
                            {
                                id: uuid.v4(),
                                items: project,
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
                'Malformed request - User instance not found');
        }
    };

    return this;
};
