'use strict';
module.exports = function (app) {
    var project = app.controllers.project;

    app.get('/projects/:code', app.authenticate, project.get);
    app.put('/projects/:code', app.authenticate, project.update);
    app.delete('/projects/:code', app.authenticate, project.delete);

    app.get('/projects', app.authenticate, project.list);

    app.post('/projects', app.authenticate, project.create);

    return this;
};
