'use strict';
module.exports = function(app) {

    var project = app.controllers.project;

    app.get('/projects', project.list);

    return this;
};
