/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');

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

const getDays = days => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
const getMinutes = minutes => Date.now() + minutes * 60 * 1000;

module.exports = {
  onMongooseConnect,
  applyMiddlewares,
  getDays,
  getMinutes,
  catchAsync
};
