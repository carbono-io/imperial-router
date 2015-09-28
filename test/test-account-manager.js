'use strict';
var AccountManagerHelper = require('../app/lib/AccountManagerHelper.js');
var should = require('chai').should();
var helper = new AccountManagerHelper('http://localhost:3000/account-manager');

describe('AccountManagerHelper', function () {

    describe('listProjects()', function () {
        it('Should list projects from a user', function (done) {
            var promiss = helper.listProjects({
                owner: 'email@200.com',
            });
            promiss
                .then(
                    function (res) {
                        should;
                        res.should.be.instanceof(Array);
                        res[0].should.have.property('project');
                        res[0].project.should.have.property('safeName');
                        res[0].project.should.have.property('name');
                        res[0].project.should.have.property('description');
                        res[0].project.should.have.property('code');
                        res[0].project.should.have.property('access');
                        res[0].project.should.have.property('owner');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not list projects from a wrong user param', function (done) {
            var promiss = helper.listProjects({
                owner: 'email@400.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not list projects from a not found user', function (done) {
            var promiss = helper.listProjects({
                owner: 'email@404.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not list projects without user user', function (done) {
            var promiss = helper.listProjects({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('createProject()', function () {
        it('Should create projects from a user', function (done) {
            var promiss = helper.createProject({
                owner: 'email@email.com',
                name: 'Project 201',
                description: 'Descricao',
            });
            promiss
                .then(
                    function (res) {
                        res[0].should.have.property('project');
                        res[0].project.should.have.property('safeName');
                        res[0].project.should.have.property('name');
                        res[0].project.should.have.property('description');
                        res[0].project.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not create projects from a wrong user param',
        function (done) {
            var promiss = helper.createProject({
                owner: 'email@email.com',
                name: 'Project 400',
                description: 'Descricao',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create projects without info', function (done) {
            var promiss = helper.createProject({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('getProject()', function () {
        it('Should get a project from a user', function (done) {
            var promiss = helper.getProject({
                owner: 'email@200.com',
                code: 'project-200',
            });
            promiss
                .then(
                    function (res) {
                        res.should.be.instanceof(Array);
                        res[0].should.have.property('project');
                        res[0].project.should.have.property('safeName');
                        res[0].project.should.have.property('name');
                        res[0].project.should.have.property('description');
                        res[0].project.should.have.property('code');
                        res[0].project.should.have.property('access');
                        res[0].project.should.have.property('owner');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a project with invalid owner', function (done) {
            var promiss = helper.getProject({
                owner: 'email@400.com',
                code: 'project-200',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a project with unauthorized user', function (done) {
            var promiss = helper.getProject({
                owner: 'email@403.com',
                code: 'project-200',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(403);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a project with not found user', function (done) {
            var promiss = helper.getProject({
                owner: 'email@404.com',
                code: 'project-200',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not list projects without info', function (done) {
            var promiss = helper.getProject({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('updateProject()', function () {
        it('Should update a project', function (done) {
            var promiss = helper.updateProject({
                code: 'project-201',
                owner: 'email@200.com',
                name: 'Project updated',
                description: 'Descricao',
            });
            promiss
                .then(
                    function (res) {
                        res[0].should.have.property('project');
                        res[0].project.should.have.property('safeName');
                        res[0].project.should.have.property('name');
                        res[0].project.should.have.property('description');
                        res[0].project.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not update a project with invalid user', function (done) {
            var promiss = helper.updateProject({
                code: 'project-201',
                owner: 'email@400.com',
                name: 'Project updated',
                description: 'Descricao',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not update a project with not found user', function (done) {
            var promiss = helper.updateProject({
                code: 'project-201',
                owner: 'email@404.com',
                name: 'Project updated',
                description: 'Descricao',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not update a project with unauthorized user',
        function (done) {
            var promiss = helper.updateProject({
                code: 'project-201',
                owner: 'email@403.com',
                name: 'Project updated',
                description: 'Descricao',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(403);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not update a project without info', function (done) {
            var promiss = helper.updateProject({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('deleteProject()', function () {
        it('Should delete a project from a user', function (done) {
            var promiss = helper.deleteProject({
                owner: 'email@200.com',
                code: 'project-200',
            });
            promiss
                .then(
                    function (res) {
                        res.should.be.instanceof(Array);
                        res[0].should.have.property('project');
                        res[0].project.should.have.property('safeName');
                        res[0].project.should.have.property('name');
                        res[0].project.should.have.property('description');
                        res[0].project.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not delete a project with invalid owner', function (done) {
            var promiss = helper.deleteProject({
                owner: 'email@400.com',
                code: 'project-200',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not delete a project with unauthorized user',
        function (done) {
            var promiss = helper.deleteProject({
                owner: 'email@403.com',
                code: 'project-200',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(403);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not delete a project with not found user', function (done) {
            var promiss = helper.deleteProject({
                owner: 'email@404.com',
                code: 'project-200',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not delete a project without info', function (done) {
            var promiss = helper.deleteProject({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('createProfile()', function () {
        it('Should create a profile', function (done) {
            var promiss = helper.createProfile({
                email: 'email@email.com',
                name: 'John Connor 201',
                password: 'passs',
            });
            promiss
                .then(
                    function (res) {
                        res.should.be.instanceof(Array);
                        res[0].should.have.property('profile');
                        res[0].profile.should.have.property('name');
                        res[0].profile.should.have.property('email');
                        res[0].profile.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile with malformed request',
        function (done) {
            var promiss = helper.createProfile({
                email: 'email@email.com',
                name: 'John Connor 400',
                password: 'passs',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile without params', function (done) {
            var promiss = helper.createProfile({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('getProfile()', function () {
        it('Should get a profile', function (done) {
            var promiss = helper.getProfile({
                code: 'user200',
            });
            promiss
                .then(
                    function (res) {
                        res.should.be.instanceof(Array);
                        res[0].should.have.property('profile');
                        res[0].profile.should.have.property('name');
                        res[0].profile.should.have.property('email');
                        res[0].profile.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with malformed request',
        function (done) {
            var promiss = helper.getProfile({
                code: 'user400',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with not found user',
        function (done) {
            var promiss = helper.getProfile({
                code: 'user404',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile without params', function (done) {
            var promiss = helper.getProfile({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('getUser()', function () {
        it('Should get a profile', function (done) {
            var promiss = helper.getUser({
                email: 'email@200.com',
            });
            promiss
                .then(
                    function (res) {
                        res.should.be.instanceof(Array);
                        res[0].should.have.property('profile');
                        res[0].profile.should.have.property('name');
                        res[0].profile.should.have.property('email');
                        res[0].profile.should.have.property('code');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with malformed request',
        function (done) {
            var promiss = helper.getUser({
                email: 'email@400.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with not found user',
        function (done) {
            var promiss = helper.getUser({
                email: 'email@404.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile without params', function (done) {
            var promiss = helper.getUser({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(500);
                })
                .done(function () {
                    done();
                });
        });
    });

});
