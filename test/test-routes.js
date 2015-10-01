'use strict';

var request = require('supertest');
var sinon    = require('sinon');
var authenticate = require('../app/authenticate');
var should = require('chai').should();

var url = 'http://localhost:7877/imperial';

var server = request.agent(url);

function defaultResponse(res) {
    res.should.have.property('apiVersion');
    res.should.have.property('id');
    res.should.have.property('data');
    res.data.should.have.property('items');
    res.data.items.should.be.instanceof(Array);
}

function defaultErrorResponse(res) {
    res.should.have.property('apiVersion');
    res.should.have.property('id');
    res.should.have.property('error');
    res.error.should.have.property('code');
    res.error.should.have.property('message');
}

function correctPostMessage(info) {
    return {
            apiVersion: '1.0',
            id: '12345',
            data: {
                id: '98765',
                items: [
                    info,
                ],
            },
        };
}
var serverObj;

function buildUser(code) {
    return {
        provider: 'carbono-oauth2',
        id: 'ladas45Fake',
        displayName: 'Fake Name',
        name: {
            familyName: 'Fake Name',
            givenName: 'Fake Name',
            middleName: '',
        },
        emails: [{
            value: 'email@' + code + '.com',
            type: 'personal',
        },],
        photos: [],
    };
}

function createImperialStub() {
    var imperialStub = sinon.stub(authenticate, 'auth',
    function (req, res, next) {
        var token = req.headers.authorization.split(' ');
        if (token.length <= 1) {
            next();
        } else {
            switch (token[1]) {
                case 'token_200': {
                    req.user = buildUser(200);
                    break;
                }
                case 'token_201': {
                    req.user = buildUser(201);
                    break;
                }
                case 'token_400': {
                    req.user = buildUser(400);
                    break;
                }
                case 'token_403': {
                    req.user = buildUser(403);
                    break;
                }
                case 'token_404': {
                    req.user = buildUser(404);
                    break;
                }
                case 'token_500': {
                    req.user = buildUser(500);
                    break;
                }
                default: {
                    break;
                }
            }
            next();
        }
    });
    return imperialStub;
}

describe('Routing tests --> ', function () {
    before(function (done) {
        this.timeout(5000);
        createImperialStub();
        serverObj = require('../');

        done();

    });

    after(function (done) {
        serverObj.close();
        done();
    });

    describe('Get User Info /users/ - ', function () {
        it('can get a user info', function (done) {
            server
                .get('/users/')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = res.body;
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].
                        should.have.property('profile');
                        jsonResponse.data.items[0].
                        profile.should.have.property('code');
                        jsonResponse.data.items[0].
                        profile.should.have.property('email');
                        jsonResponse.data.items[0].
                        profile.should.have.property('name');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Malformed Req', function (done) {
            server
                .get('/users/')
                .set('Authorization', 'Bearer token_400')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Token invalid', function (done) {
            server
                .get('/users/')
                .set('Authorization', 'Bearer token_unauthorized')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Not found', function (done) {
            server
                .get('/users/')
                .set('Authorization', 'Bearer token_404')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Unexpected Error', function (done) {
            server
                .get('/users/')
                .set('Authorization', 'Bearer token_500')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Create User /profiles/ - ', function () {
        it('can create profile', function (done) {
            server
                .post('/profiles/')
                .send(correctPostMessage({
                        name: 'John Connor 201',
                        email: 'email@email.com',
                        password: 'senha123',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    try {
                        var jsonResponse = res.body;
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].should.have.
                        property('profile');
                        jsonResponse.data.items[0].profile.should.have.
                        property('code');
                        jsonResponse.data.items[0].profile.should.have.
                        property('name');
                        jsonResponse.data.items[0].profile.should.have.
                        property('email');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create profile without email', function (done) {
            server
                .post('/profiles/')
                .send(correctPostMessage({
                        name: 'John Connor 201',
                        password: 'senha123',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create profile - invalid message structure',
        function (done) {
            server
                .post('/profiles/')
                .send({
                        name: 'John Connor 201',
                        email: 'email@email.com',
                        password: 'senha123',
                    })
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create profile - Malformed Request', function (done) {
            server
                .post('/profiles/')
                .send(correctPostMessage({
                        name: 'John Connor 400',
                        email: 'email@email.com',
                        password: 'senha123',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create profile - Unexpected Error', function (done) {
            server
                .post('/profiles/')
                .send(correctPostMessage({
                        name: 'John Connor 500',
                        email: 'email@email.com',
                        password: 'senha123',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Get User Info /profiles/ - ', function () {
        it('can get a user info', function (done) {
            server
                .get('/profiles/user200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    try {
                        var jsonResponse = res.body;
                        defaultResponse(jsonResponse);
                        jsonResponse.data.items[0].
                        should.have.property('profile');
                        jsonResponse.data.items[0].
                        profile.should.have.property('code');
                        jsonResponse.data.items[0].
                        profile.should.have.property('email');
                        jsonResponse.data.items[0].
                        profile.should.have.property('name');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Malformed Req', function (done) {
            server
                .get('/profiles/user400')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Not found', function (done) {
            server
                .get('/profiles/user404')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Unexpected Error', function (done) {
            server
                .get('/profiles/user500')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Get project with code /projects/:code - ', function () {
        it('can get a project', function (done) {
            server
                .get('/projects/project-200')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    res.status.should.equal(200);
                    should.not.exist(err);
                    try {
                        var jsonRes = res.body;
                        defaultResponse(jsonRes);
                        jsonRes.data.items[0].should.have.property('project');
                        jsonRes.data.items[0].project
                        .should.have.property('code');
                        jsonRes.data.items[0].project
                        .should.have.property('safeName');
                        jsonRes.data.items[0].project
                        .should.have.property('name');
                        jsonRes.data.items[0].project
                        .should.have.property('description');
                        jsonRes.data.items[0].project
                        .should.have.property('access');
                        jsonRes.data.items[0].project
                        .should.have.property('owner');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('Cannot get project - Malformed Req', function (done) {
            server
                .get('/projects/project-200')
                .set('Authorization', 'Bearer token_400')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get project - Token invalid', function (done) {
            server
                .get('/projects/project-200')
                .set('Authorization', 'Bearer token_unauthorized')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get project - Not found', function (done) {
            server
                .get('/projects/project-404')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot get user info - Unexpected Error', function (done) {
            server
                .get('/projects/project-200')
                .set('Authorization', 'Bearer token_500')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('List projects from user /projects/ - ', function () {
        it('can list projects', function (done) {
            server
                .get('/projects/project-200')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    res.status.should.equal(200);
                    should.not.exist(err);
                    try {
                        var jsonRes = res.body;
                        defaultResponse(jsonRes);
                        jsonRes.data.items[0].should.have.property('project');
                        jsonRes.data.items[0].project
                        .should.have.property('code');
                        jsonRes.data.items[0].project
                        .should.have.property('safeName');
                        jsonRes.data.items[0].project
                        .should.have.property('name');
                        jsonRes.data.items[0].project
                        .should.have.property('description');
                        jsonRes.data.items[0].project
                        .should.have.property('access');
                        jsonRes.data.items[0].project
                        .should.have.property('owner');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('Cannot list projects - Malformed Req', function (done) {
            server
                .get('/projects/')
                .set('Authorization', 'Bearer token_400')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot list projects - Token invalid', function (done) {
            server
                .get('/projects/')
                .set('Authorization', 'Bearer token_unauthorized')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot list projects - Not found', function (done) {
            server
                .get('/projects/')
                .set('Authorization', 'Bearer token_404')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot list projects - Unexpected Error', function (done) {
            server
                .get('/projects/')
                .set('Authorization', 'Bearer token_500')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Create a project /projects/ - ', function () {
        it('can create a project', function (done) {
            server
                .post('/projects/')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        name: 'Project 201',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    try {
                        var jsonRes = res.body;
                        defaultResponse(jsonRes);
                        jsonRes.data.items[0].should.have.property('project');
                        jsonRes.data.items[0].project
                        .should.have.property('code');
                        jsonRes.data.items[0].project
                        .should.have.property('safeName');
                        jsonRes.data.items[0].project
                        .should.have.property('name');
                        jsonRes.data.items[0].project
                        .should.have.property('description');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create a project without name', function (done) {
            server
                .post('/projects/')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create a project with invalid token', function (done) {
            server
                .post('/projects/')
                .set('Authorization', 'Bearer token_unauthorized')
                .send(correctPostMessage({
                        name: 'Project 201',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot create a project Internal server error', function (done) {
            server
                .post('/projects/')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        name: 'Project 500',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Update a project /projects/:code - ', function () {
        it('can update a project', function (done) {
            server
                .put('/projects/project-201')
                .set('Authorization', 'Bearer token_200')
                .send(correctPostMessage({
                        name: 'Project Name',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    try {
                        var jsonRes = res.body;
                        defaultResponse(jsonRes);
                        jsonRes.data.items[0].should.have.property('project');
                        jsonRes.data.items[0].project
                        .should.have.property('code');
                        jsonRes.data.items[0].project
                        .should.have.property('safeName');
                        jsonRes.data.items[0].project
                        .should.have.property('name');
                        jsonRes.data.items[0].project
                        .should.have.property('description');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot update a project without name', function (done) {
            server
                .put('/projects/project-201')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot update a project with invalid token', function (done) {
            server
                .put('/projects/project-201')
                .set('Authorization', 'Bearer token_unauthorized')
                .send(correctPostMessage({
                        name: 'Project Name',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot update a project without write access', function (done) {
            server
                .put('/projects/project-201')
                .set('Authorization', 'Bearer token_403')
                .send(correctPostMessage({
                        name: 'Project Name',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot update a project - malformed request', function (done) {
            server
                .put('/projects/project-400')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        name: 'Project 400',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot update a project - project not found', function (done) {
            server
                .put('/projects/project-404')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        name: 'Project 404',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot update a project - Internal server error', function (done) {
            server
                .put('/projects/project-500')
                .set('Authorization', 'Bearer token_201')
                .send(correctPostMessage({
                        name: 'Project 500',
                        description: 'Description',
                    }))
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });
    });

    describe('Delete a project /projects/:code - ', function () {
        it('can delete a project', function (done) {
            server
                .delete('/projects/project-200')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    try {
                        var jsonRes = res.body;
                        defaultResponse(jsonRes);
                        jsonRes.data.items[0].should.have.property('project');
                        jsonRes.data.items[0].project
                        .should.have.property('code');
                        jsonRes.data.items[0].project
                        .should.have.property('safeName');
                        jsonRes.data.items[0].project
                        .should.have.property('name');
                        jsonRes.data.items[0].project
                        .should.have.property('description');
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot delete a project without authorization', function (done) {
            server
                .delete('/projects/project-200')
                .set('Authorization', 'Bearer')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot delete a project - malformed request', function (done) {
            server
                .delete('/projects/project-400')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot delete a project - not found', function (done) {
            server
                .delete('/projects/project-404')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot delete a project - Internal server error', function (done) {
            server
                .delete('/projects/project-500')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    try {
                        var jsonResponse = res.body;
                        defaultErrorResponse(jsonResponse);
                    } catch (e) {
                        return done(e);
                    }
                    done();
                });
        });

        it('cannot delete a project without code', function (done) {
            server
                .delete('/projects/')
                .set('Authorization', 'Bearer token_200')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(404);
                    done();
                });
        });
    });
});