'use strict';
var q = require('q');
var request = require('request');
var uuid = require('node-uuid');
var pjson = require('../../package.json');

/**
 * Class that comminicates with Account Manager
 *
  @class
 * @param {string} accmPath - The account manager url
 */
var AccountManager = function (accmPath) {
    this.path = accmPath;
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
        request({
                headers: {
                    crbemail: data.owner,
                },
                uri: this.path + '/projects',
                method: 'GET',
            },
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = JSON.parse(res.body);
                            deferred.resolve(jsonRes.data.items);
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            var jsonRes = JSON.parse(res.body);
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

AccountManager.prototype.buildCreateUpdateProject = function (data) {
    return {
        headers: {
            crbemail: data.owner,
        },
        uri: this.path + data.url + data.code,
        method: data.method,
        json: {
            apiVersion: pjson.version,
            id: uuid.v4(),
            data:
                {
                    id: uuid.v4(),
                    items: [{
                        name: data.name,
                        description: data.description,
                    },],
                },
        },
    };
}

AccountManager.prototype.buildCreateUpdateProfile = function (data) {
    return {
        uri: this.path + data.url + data.code,
        method: data.method,
        json: {
            apiVersion: pjson.version,
            id: uuid.v4(),
            data:
                {
                    id: uuid.v4(),
                    items: [{
                        name: data.name,
                        password: data.password,
                        email: data.email,
                    },],
                },
        },
    };
}

/**
 * Communicates with Account Manager and creates a project
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 * @param {string} data.name - The name of the project
 * @param {string} data.description - The description of the project
 */
AccountManager.prototype.createProject = function (data) {
    var deferred = q.defer();
    try {
        var options = 
        request(this.buildCreateUpdateProject(
            {
                method: 'POST',
                owner: data.owner,
                name: data.name,
                description: data.description,
                code: '',
                url: '/projects/',
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
                        message: 'Could not create project',
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

/**
 * Communicates with Account Manager and gets a project from a user
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 * @param {string} data.code - The code of the project
 */
AccountManager.prototype.getProject = function (data) {
    var deferred = q.defer();
    try {
        request({
                headers: {
                    crbemail: data.owner,
                },
                uri: this.path + '/projects/' + data.code,
                method: 'GET',
            },
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = JSON.parse(res.body);
                            deferred.resolve(jsonRes.data.items);
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            var jsonRes = JSON.parse(res.body);
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
                        message: 'Could not get project',
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

/**
 * Communicates with Account Manager and updates a project
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 * @param {string} data.code - The code of the project
 * @param {string} data.name - The name of the project
 * @param {string} data.description - The description of the project
 */
AccountManager.prototype.updateProject = function (data) {
    var deferred = q.defer();
    try {
        var options = 
        request(this.buildCreateUpdateProject(
            {
                method: 'PUT',
                owner: data.owner,
                name: data.name,
                description: data.description,
                code: data.code,
                url: '/projects/',
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
                        message: 'Could not update project',
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

/**
 * Communicates with Account Manager and deletes a project from a user
 *
 * @function
 * @param {Object} data - Project data
 * @param {string} data.owner - The owner of the project
 * @param {string} data.code - The code of the project
 */
AccountManager.prototype.deleteProject = function (data) {
    var deferred = q.defer();
    try {
        request({
                headers: {
                    crbemail: data.owner,
                },
                uri: this.path + '/projects/' + data.code,
                method: 'DELETE',
            },
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = JSON.parse(res.body);
                            deferred.resolve(jsonRes.data.items);
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            var jsonRes = JSON.parse(res.body);
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
                        message: 'Could not delete project',
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

/**
 * Communicates with Account Manager and creates a profile
 *
 * @function
 * @param {Object} data - Profile data
 * @param {string} data.name - The name of the user
 * @param {string} data.email - The description of the user
 * @param {string} data.password - The password of the user
 */
AccountManager.prototype.createProfile = function (data) {
    var deferred = q.defer();
    try {
        var options = 
        request(this.buildCreateUpdateProfile(
            {
                method: 'POST',
                email: data.email,
                name: data.name,
                password: data.password,
                code: '',
                url: '/profiles/',
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
                        message: 'Could not create profile',
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

/**
 * Communicates with Account Manager and gets a profile from profile id
 *
 * @function
 * @param {Object} data - Profile data
 * @param {string} data.code - The code of the profile
 */
AccountManager.prototype.getProfile = function (data) {
    var deferred = q.defer();
    try {
        var options = 
        request({
                uri: this.path + '/profiles/' + data.code,
                method: 'GET',
            },
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = JSON.parse(res.body);
                            deferred.resolve(jsonRes.data.items);
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            jsonRes = JSON.parse(res.body);
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
                        message: 'Could not get profile',
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

/**
 * Communicates with Account Manager and gets a profile from user email
 *
 * @function
 * @param {Object} data - Profile data
 * @param {string} data.email - The email of the profile
 */
AccountManager.prototype.getUser = function (data) {
    var deferred = q.defer();
    try {
        var options = 
        request({
            headers: {
                    crbemail: data.email,
                },
                uri: this.path + '/users/',
                method: 'GET',
            },
            function (err, res) {
                if (!err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = JSON.parse(res.body);
                            deferred.resolve(jsonRes.data.items);
                        } catch (e) {
                            deferred.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        try {
                            jsonRes = JSON.parse(res.body);
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
                        message: 'Could not get user',
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
