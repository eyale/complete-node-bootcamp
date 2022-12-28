const express = require('express');
const morgan = require('morgan');

const applyMiddlewares = (app) => {
  app.use(morgan('dev'));
  app.use(express.json());

  app.use(function (req, res, next) {
    req.requestTime = new Date().toISOString();
    next();
  });
};

module.exports = { applyMiddlewares };
