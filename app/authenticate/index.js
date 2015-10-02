'use strict';

var passport = require('passport');

module.exports.auth = passport.authenticate('bearer', { session: false });