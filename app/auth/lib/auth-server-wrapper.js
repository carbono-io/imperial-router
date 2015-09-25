'use strict';

/**
 * Helper methods to communicate with Authentication Server
 *
 * @module Authentication Server Client
 */

var pjson   = require('../../../package.json');
var CJM     = require('carbono-json-messages');
var request = require('request');
var uuid    = require('node-uuid');
var q       = require('q');

/**
 * Try to extract user informations.
 *
 * @param {string} message - body attribute extracted from response object.
 * @return {Object=} Object representing an User.
 *
 * @function
 */
function extractUser(message) {
    var validStructure = message &&
        message.hasOwnProperty('data') &&
        message.data.hasOwnProperty('items') &&
        message.data.items.length > 0 &&
        message.data.items[0].hasOwnProperty('userInfo');

    if (validStructure) {
        return message.data.items[0].userInfo;
    }

    return null;
}

/**
 * Builds the options used by request module.
 *
 * @param {string} token - Bearer Token
 * @param {string} authUrl - Base url for access carbono-auth
 * @return {Object} Object representing options for request module.
 *
 * @function
 */
function buildRequestOptions(token, authUrl) {
    var cjm = new CJM({apiVersion: pjson.version});
    cjm.setData({
        id: uuid.v4(),
        items: [
            {
                token: token,
            },
        ],
    });

    return {
        uri: 'http://' + authUrl + '/bearer/validate',
        method: 'POST',
        json: cjm.toObject(),
    };
}

/**
 * Find a user for the given token.
 *
 * @param {string} token - Bearer Token
 * @param {string} authUrl - Base url for access carbono-auth
 * @return {Object} Object representing a promise.
 *
 * @function
 */
module.exports.findUser = function (token, authUrl) {
    if (token) {
        var deffered = q.defer();

        request(
            buildRequestOptions(token, authUrl),
            function (err, res) {
                if (err) {
                    // Request error
                    deffered.reject('[VALIDATE TOKEN] Request error: ' + err);

                } else if (res.statusCode === 200) {
                    // User retrieved
                    var user = extractUser(res.body);

                    if (user) {
                        deffered.resolve(user);
                    } else {
                        deffered.reject(
                            '[VALIDATE TOKEN] Can\'t read user informations.');
                    }

                } else if (res.statusCode === 404) {
                    // User not found
                    deffered.reject(null);

                } else {
                    // Unknown status code
                    deffered.reject(
                        '[VALIDATE TOKEN] Error: ' + res.statusCode);
                }
            });

        return deffered.promise;
    }

    return null;
};
