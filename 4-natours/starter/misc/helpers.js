/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

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
  app.use(express.json({ limit: '10kb' }));
  app.use(express.static(`${__dirname}/../public`));
  app.use(addRequestedAtToParams);
};

const getDays = days => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
const getMinutes = minutes => Date.now() + minutes * 60 * 1000;
const getMillisecondsFromMinutes = minutes => minutes * 60 * 1000;

const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes)
  windowMs: getMillisecondsFromMinutes(60),
  message: 'Too many requests. Try again in 1 hour.'
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

module.exports = {
  onMongooseConnect,
  applyMiddlewares,
  getDays,
  getMinutes,
  getMillisecondsFromMinutes,
  limiter,
  catchAsync
};
