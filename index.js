const log = require('./lib/Log');
const middleware = require('./lib/Middleware');

module.exports = log;
module.exports.log = log;
module.exports.logMiddleware = middleware;
