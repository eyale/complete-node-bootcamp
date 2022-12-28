const express = require('express');
const morgan = require('morgan');
const path = require('path');

const K = require(`${__dirname}/constants.js`);

const onAppStart = () => {
  console.log(`${K.APP_NAME} is 🏃🏼‍♂️ at ${K.PORT}...`);
};

const addRequestedAtToParams = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
};

const checkBody = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(404).json({
      status: K.STATUS.fail,
      message: 'Invalid name or price parameter',
    });
  }

  next();
};

const checkId = (req, res, next, val) => {
  const id = parseInt(val);
  const tourItem = K.toursData.find((tour) => tour.id === id);

  if (!tourItem) {
    return res.status(404).json({
      status: K.STATUS.fail,
      message: `Invalid id: ${id}`,
    });
  }
  next();
};

const applyMiddlewares = (app) => {
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.static(`${__dirname}/../public`));
  app.use(addRequestedAtToParams);
};

module.exports = { onAppStart, applyMiddlewares, checkId, checkBody };
