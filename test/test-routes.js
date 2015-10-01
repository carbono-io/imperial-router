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
var profileCode = null;
function setCreatedProfileCode (code) {
    profileCode = code;   
}

function getCreatedProfileCode () {
    return profileCode;   
}

var serverObj;

function createImperialStub() {
    var aux = {
        authenticate: authenticate
    }
    var imperialStub = sinon.stub(authenticate, 'auth', function (req, res, next) {
        res.user = {
            emails: [{
                value: 'email@200.com',
            }
                ],
        }
        res.send();
    });
    return imperialStub;
}

describe('Routing tests --> ', function () {
    before(function (done) { 
        
        this.timeout(5000);
        createImperialStub();
        serverObj = require('../');
        // createImperialStub();
        
        done();
        
    });

    after(function (done) {
        serverObj.close();
        done();
    });

    describe('Basic routes - This test should work when:', function () {
        it('a username is valid', function (done) {
            server
                .get('/users/')
                .set('Authorization', 'Bearer token_valid')
                .end(function (err, res) {
                    console.log(res)
                  
                    done();
                });
        });
    });
});