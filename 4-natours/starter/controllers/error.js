/* eslint-disable no-console */
const AppError = require(`${__dirname}/../misc/appError`);

const K = require(`${__dirname}/../misc/constants`);

const handleNotFoundRequest = (req, res, next) => {
  next(new AppError(`${req.method} ${req.originalUrl} not found`, 404));
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  // Operational error - trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Unknown error
    console.error('❗ ERROR', err);

    res.status(err.statusCode).json({
      status: K.STATUS.error,
      message: 'Something went wrong 🤕'
    });
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = err => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Invalid property value: ${value}. Use different`;
  return new AppError(message, 400);
};

const handleValidationError = error => {
  const errors = Object.values(error.errors).map(item => {
    console.log('❗ =>\n\n\n item', item);
    return item;
  });
  const message = `Invalid  ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token', 401);

const handleJWTExpireError = token =>
  new AppError(`Access token expired: ${token}`, 401);

const errorMiddleware = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || K.STATUS.error;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = Object.assign(err);

    if (error.name === K.ERROR_TYPE.cast) {
      error = handleCastErrorDB(error);
    }
    if (error.code === K.ERROR_TYPE.code11000Duplicate) {
      error = handleDuplicateError(error);
    }
    if (error.name === K.ERROR_TYPE.validation) {
      error = handleValidationError(error);
    }
    if (error.name === K.ERROR_TYPE.jsonWebTokenError) {
      error = handleJWTError(error);
    }
    if (error.name === K.ERROR_TYPE.tokenExpiredError) {
      error = handleJWTExpireError(req.headers.authorization.split(' ')[1]);
    }
    sendErrorProd(error, res);
  }
};

const uncaughtException = err => {
  console.log('\n🧨 Uncaught exception');
  console.log(`${err.name}: ${err.message}`);

  process.exit(1);
};

const unhandledRejection = (server, err) => {
  console.log('❌Unhandled rejection');
  console.log(`${err.name}: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
};

module.exports = {
  handleNotFoundRequest,
  errorMiddleware,
  uncaughtException,
  unhandledRejection
};
