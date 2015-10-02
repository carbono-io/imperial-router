'use strict';

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var helper = require('./lib/auth-server-wrapper');
var etcd = require('carbono-service-manager');

module.exports = function (app) {
    app.use(passport.initialize());

    passport.use(new BearerStrategy(
        function (token, done) {
            var promise = helper.findUser(token, etcd.getServiceUrl('auth'));

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
