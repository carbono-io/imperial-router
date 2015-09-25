'use strict';
var q = require('q');
var request = require('request');
var uuid = require('node-uuid');
var pjson = require('../../package.json');

var path = null;

/**
 * Builds a request for the request module
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the projects
 */
function buildRequest(data) {
    return {
        headers: {
            crbemail: data.owner,
        },
        uri: path + '/projects',
        method: 'GET',
    };
}
/**
 * Class that comminicates with Account Manager
 *
  @class
 * @param {string} accmPath - The account manager url
 */
var AccountManager = function (accmPath) {
    path = accmPath;
    return this;
};

/**
 * Communicates with Account Manager and lists all projects from a user
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 */
AccountManager.prototype.listProjects = function (data) {
    var deferred = q.defer();
    try {
        request(buildRequest(
            {
                owner: data.owner,
            }),
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = res.body;
                            deferred.resolve(jsonRes.data.items);
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            jsonRes = res.body;
                            deferred.reject({
                                code: jsonRes.error.code,
                                message: jsonRes.error.message,
                            });
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    }
                } else {
                    deferred.reject({
                        code: 500,
                        message: 'Could not list projects',
                    });
                }
            }
        );
    } catch (e) {
        deferred.reject({
                code: 500,
                message: e,
            });
    }
    return deferred.promise;
};
module.exports = AccountManager;
