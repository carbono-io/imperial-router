'use strict';

var should = require('chai').should();
var JsonMessages = require('../');

describe('Testator', function () {
    describe('using index.js', function () {
        it('common using version 1.0', function () {
            var resp = new JsonMessages({apiVersion: '1.0'});
            resp.setData(
                {
                    id: '1234',
                    items: [{foo: 'bar'}],
                }
            );
            var json = JSON.parse(resp.toJSON());

            should.exist(json.apiVersion, 'json.apiVersion');
            json.apiVersion.should.be.equals('1.0');
        });
    });
});
