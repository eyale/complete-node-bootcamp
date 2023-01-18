/**
 * AppError class
 */

const K = require(`${__dirname}/constants.js`);

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? K.STATUS.fail
      : K.STATUS.error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
