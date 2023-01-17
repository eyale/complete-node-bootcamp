const express = require('express');

const K = require(`${__dirname}/misc/constants`);
const helpers = require(`${__dirname}/misc/helpers`);
const toursRouter = require(`${__dirname}/routes/tours`);
const usersRouter = require(`${__dirname}/routes/users`);
const app = express();

// middleware
helpers.applyMiddlewares(app);
/**
 * TOURS
 */
app.use(K.ROUTES.v1.tours, toursRouter);
/**
 * USERS
 */
app.use(K.ROUTES.v1.users, usersRouter);
/**
 * ALL OTHERS REQUESTS
 */
app.all('*', helpers.handleNotFoundRequest);

module.exports = app;
