'use strict';

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var helper = require('./lib/auth-server-wrapper');

module.exports = function (app, etcdManager) {
    app.use(passport.initialize());
    app.use(passport.authenticate('bearer', { session: false }));

    passport.use(new BearerStrategy(
        function (token, done) {
            var promise = helper.findUser(token, etcdManager.getAuthUrl());

            if (promise) {
                promise.then(
                    function (user) {
                        return done(null, user);
                    },
                    function (err) {
                        if (err) { return done(err); }
                        return done(null, false);
                    }
                );
            }
        }
    ));
};
