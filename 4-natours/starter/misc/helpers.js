/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');

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
  // res.status(404).json({
  //   status: K.STATUS.fail,
  //   message: `${req.originalUrl} not found`
  // });
  const err = new Error(`${req.originalUrl} not found`);
  err.status = K.STATUS.fail;
  err.statusCode = 404;
  next(err);
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || K.STATUS.error;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};

module.exports = {
  onAppStart,
  onMongooseConnect,
  applyMiddlewares,
  handleNotFoundRequest,
  errorMiddleware
};
