'use strict';
/**
 * This file contains all json message API helper functions for carbono.
 *
 * @author Carbono Team
 * @module carbono-json-messages
 */
var uuid = require('node-uuid');

/**
 * Class to create a new JSON message.
 *
 * @param {Object} params - params to create a JSON message.
 * @param {string} params.apiVersion - specify the version.
 * @param {string} [params.id=uuid auto generated] - internal unique message id.
 *
 * @class
 */
var CarbonoJsonMessages = function CarbonoJsonMessages(params) {
    if (!params) {
        throw new Error('No params for CarbonoJsonMessages instantiation.');
    }

    this.apiVersion = params.apiVersion;
    this.id         = params.id || uuid.v4(); // random uuid
};

/**
 * Set data object on the message.
 * This function should be used to create a success JSON message.
 *
 * @param {Object} data - must be compliant with Google JSON Style Guide.
 * @returns {Object} returns own reference (this).
 *
 * @function
 */
CarbonoJsonMessages.prototype.setData = function (data) {
    this.data = data;

    return this;
};

/**
 * Set error object on the message.
 * This function should be used to create an error JSON message.
 *
 * @param {Object | int} error Accepts error object or error code
 *  - must be compliant with Google JSON Style Guide.
 * @param {string} [error] - contain error code.
 * @param {Object[]} [errors] - must be compliant with Google JSON Style Guide.
 * @returns {Object} returns own reference (this).
 *
 * @function
 */
CarbonoJsonMessages.prototype.setError = function (error, message, errors) {
    if (typeof error === 'object') {
        this.error = error;
    } else {
        this.error = {
            code: error,
            message: message,
            errors: errors,
        };
    }

    return this;
};

/**
 * Returns JSON stringfy for the internal JSON message.
 *
 * @return {Object} json - return generated json message.
 *
 * @function
 */
CarbonoJsonMessages.prototype.toJSON = function () {
    return JSON.stringify(this.toObject());
};

/**
 * Returns Object for the internal JSON message.
 *
 * @return {Object} obhect - return generated object message.
 *
 * @function
 */
CarbonoJsonMessages.prototype.toObject = function () {
    var obj = {
        apiVersion: this.apiVersion,
        id: this.id,
        data: this.data,
        error: this.error,
    };

    return obj;
};

module.exports = CarbonoJsonMessages;
