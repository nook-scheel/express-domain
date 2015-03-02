
/*!
 * Module dependencies.
 */

var domain = require('domain');

/**
 * Middleware.
 * 
 * @param {Request} req
 * @param {Response} res
 */

module.exports = function () {
  return function domainMiddleware(req, res, next) {
    var reqDomain = domain.create()
      , ended = false;

    reqDomain.add(req);
    reqDomain.add(res);

    reqDomain.on('error', next);

    reqDomain.run(next);
  };
};
