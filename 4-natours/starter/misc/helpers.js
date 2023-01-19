/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');

const AppError = require(`${__dirname}/appError.js`);

const K = require(`${__dirname}/constants.js`);

const onAppStart = () => {
  console.log(`📲 ${K.APP_NAME} is running `);
};

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
    sendErrorProd(error, res);
  }
};

module.exports = {
  onAppStart,
  onMongooseConnect,
  applyMiddlewares,
  handleNotFoundRequest,
  errorMiddleware,
  catchAsync
};
