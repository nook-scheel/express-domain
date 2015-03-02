
/**
 * Module dependencies.
 */

var express = require('express')
  , expressDomain = require('../')
  , should = require('should')
  , request = require('supertest');

describe('domain.test.js', function () {
  var normalHandler = function normalHandler(req, res, next) {
    if (req.url === '/sync_error') {
      throw new Error('sync_error');
    }
    if (req.url === '/async_error') {
      process.nextTick(function () {
        ff.foo();
      });
      return;
    }
    res.end(req.url);
  };

  var errorHandler = function errorHandler(err, req, res, next) {
    res.statusCode = 500;
    res.end(err.message);
  };

  var app = express()
    .use(expressDomain())
    .use(normalHandler)
    .use(errorHandler);

  it('should GET / status 200', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should GET /sync_error status 500', function (done) {
    request(app)
      .get('/sync_error')
      .expect('sync_error')
      .expect(500, done);
  });

  it('should GET /async_error status 500', function (done) {
    request(app)
      .get('/async_error')
      .expect('ff is not defined')
      .expect(500, done);
  });

});
