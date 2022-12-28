const express = require('express');
const morgan = require('morgan');
const K = require(`${__dirname}/constants.js`);

const onAppStart = () => {
  console.log(`${K.APP_NAME} is 🏃🏼‍♂️ at ${K.PORT}...`);
};

const applyMiddlewares = (app) => {
  app.use(morgan('dev'));
  app.use(express.json());

  app.use(function (req, res, next) {
    req.requestTime = new Date().toISOString();
    next();
  });
};

module.exports = { onAppStart, applyMiddlewares };
