const { Console } = require('console');
const { EOL } = require('os');
const { DateTime } = require('luxon');
const { gray, cyan, yellow, magenta, red, green } = require('chalk');

/**
 * Log class.
 * @extends Console
 */
class Log extends Console {
  /**
   * Passes the stdout and stderr streams to the Console constructor.
   * @constructor
   */
  constructor () {
    super(process.stdout, process.stderr);
  }

  /**
   * Gets a UTC timestamp in SQL format.
   * https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-toSQL
   * @returns {string}
   * @private
   */
  get timeStamp () {
    const dateTime = DateTime.utc().toSQL({ includeZone: false, includeOffset: false });

    return gray(`[${dateTime}]`);
  }

  /**
   * Writes the system end-of-line character ('\n' on POSIX; '\r\n' on Windows) to stdout.
   * @returns {Log}
   */
  eol () {
    process.stdout.write(EOL);

    return this;
  }

  /**
   * Passes arguments to console.log prepended with a timestamp.
   * @returns {Log}
   */
  log () {
    const [message, ...rest] = arguments;

    super.log(`${this.timeStamp} ${message}`, ...rest);

    return this;
  }

  /**
   * Passes arguments to console.info prepended with a timestamp and 'INFO' log level.
   * @returns {Log}
   */
  info () {
    const [message, ...rest] = arguments;

    super.info(`${this.timeStamp} ${cyan('  INFO')} ${message}`, ...rest);

    return this;
  }

  /**
   * Passes arguments to console.warn prepended with a timestamp and 'WARN' log level.
   * @returns {Log}
   */
  warn () {
    const [message, ...rest] = arguments;

    super.warn(`${this.timeStamp} ${yellow('  WARN')} ${message}`, ...rest);

    return this;
  }

  /**
   * Passes arguments to console.debug prepended with a timestamp and 'DEBUG' log level.
   * @returns {Log}
   */
  debug () {
    const [message, ...rest] = arguments;

    super.debug(`${this.timeStamp} ${magenta(' DEBUG')} ${message}`, ...rest);

    return this;
  }

  /**
   * Passes arguments to console.error prepended with a timestamp and 'ERROR' log level.
   * If the first argument is an Error object, this.trace is called instead.
   * @returns {Log}
   */
  error () {
    const [message, ...rest] = arguments;

    if (message instanceof Error) {
      return this.trace(message);
    }

    super.error(`${this.timeStamp} ${red(' ERROR')} ${message}`, ...rest);

    return this;
  }

  /**
   * Writes the stack trace to stderr.
   * Each line is prepended with a timestamp and left-padded for proper alignment.
   * @param {Error} error
   * @returns {Log}
   */
  trace (error) {
    if (!(error instanceof Error)) {
      return this.error(`TypeError: ${typeof error} is not an instance of Error.`);
    }

    // Splits the stack trace by line into an array and trims the whitespace from each line
    const stack = error.stack.split(EOL).map(frame => frame.trim());

    stack.forEach(frame => {
      if (stack.indexOf(frame) === 0) {
        super.error(`${this.timeStamp} ${red(' TRACE')} ${frame}`);
      } else {
        super.error(`${this.timeStamp}        ${frame.replace(/^at /, yellow('@ '))}`);
      }
    });

    return this;
  }

  /**
   * Takes a value and message and passes to console.assert.
   * If the value is truthy, the message is written to stdout with 'ASSERT' in green.
   * If the value is falsey, the message is written to stderr with 'ASSERT' in red.
   * @returns {Log}
   */
  assert () {
    const [value, message, ...rest] = arguments;

    try {
      super.assert(value, message, ...rest);
      super.log(`${this.timeStamp} ${green('ASSERT')} ${value} ${message}`, ...rest);
    } catch (error) {
      super.error(`${this.timeStamp} ${red('ASSERT')} ${value} ${message}`, ...rest);
    }

    return this;
  }
}

const log = new Log();

module.exports = log;
