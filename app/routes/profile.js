'use strict';
module.exports = function(app) {

    var profile = app.controllers.profile;

    app.get('/users/', app.authenticate, profile.getUser);
    app.get('/profiles/:code', profile.getProfile);

    app.post('/profiles/', profile.createProfile);
    return this;
};
