const express = require('express');
const helmet = require('helmet');

const K = require(`${__dirname}/misc/constants`);
const H = require(`${__dirname}/misc/helpers`);
const errorController = require(`${__dirname}/controllers/error`);
const toursRouter = require(`${__dirname}/routes/tours`);
const usersRouter = require(`${__dirname}/routes/users`);

const app = express();

// middleware
app.use(helmet());
app.use('/api', H.limiter);
H.applyMiddlewares(app);
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
app.all('*', errorController.handleNotFoundRequest);
/**
 * ERROR MIDDLEWARE
 */
app.use(errorController.errorMiddleware);

module.exports = app;
