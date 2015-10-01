'use strict';

var passport = require('passport');

function authenticate (req, res, next) {
    passport.authenticate('bearer', { session: false });
    next();
}
module.exports.auth = authenticate;