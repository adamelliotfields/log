const responseTime = require('response-time');

const log = require('./Log');

/**
 * Middleware for Connect/Express.
 * Logs each request after the response has been sent.
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 */
const middleware = (request, response, next) => {
  /**
   * Callback function for responseTime.
   * responseTime returns a closure that calls the callback before calling next.
   * @param {Object} request
   * @param {Object} response
   * @param {number} time
   * @callback
   */
  const callback = (request, response, time) => {
    const { method, url } = request;
    const { statusCode } = response;

    const level = statusCode >= 500
      ? 'error'
      : statusCode >= 400
        ? 'warn'
        : 'info';

    const message = `${method} ${url} ${statusCode} ${time.toFixed(3)}ms`;

    log[level](message);
  };

  responseTime(callback)(request, response, next);
};

module.exports = middleware;
