/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');

const AppError = require(`${__dirname}/appError.js`);

const K = require(`${__dirname}/constants.js`);

const onMongooseConnect = _ => {
  console.log('🔌 MONGOOSE CONNECTED');
};

const addRequestedAtToParams = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
};

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// const checkBody = (req, res, next) => {
//   const { name, price } = req.body;

//   if (!name || !price) {
//     return res.status(404).json({
//       status: K.STATUS.fail,
//       message: 'Invalid name or price parameter'
//     });
//   }

//   next();
// };

// const checkId = (req, res, next, val) => {
//   const id = parseInt(val, 10);
//   const tourItem = K.toursData.find(tour => tour.id === id);

//   if (!tourItem) {
//     return res.status(404).json({
//       status: K.STATUS.fail,
//       message: `Invalid id: ${id}`
//     });
//   }
//   next();
// };

const applyMiddlewares = app => {
  if (process.env.NODE_ENV === 'development') {
    // logger
    app.use(morgan('dev'));
  }
  app.use(express.json());
  app.use(express.static(`${__dirname}/../public`));
  app.use(addRequestedAtToParams);
};

const handleNotFoundRequest = (req, res, next) => {
  next(new AppError(`${req.originalUrl} not found`, 404));
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

    // Unknown error
  } else {
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
  console.log(`${err.name}: ${err.message}`);
  console.log('🧨 Uncaught exception');

  process.exit(1);
};

const unhandledRejection = (server, err) => {
  console.log(`${err.name}: ${err.message}`);
  console.log('🧨 Unhandled rejection');

  server.close(() => {
    process.exit(1);
  });
};

module.exports = {
  onMongooseConnect,
  applyMiddlewares,
  handleNotFoundRequest,
  errorMiddleware,
  catchAsync,
  uncaughtException,
  unhandledRejection
};
