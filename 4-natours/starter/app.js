const express = require('express');
const rateLimit = require('express-rate-limit');

const K = require(`${__dirname}/misc/constants`);
const H = require(`${__dirname}/misc/helpers`);
const errorController = require(`${__dirname}/controllers/error`);
const toursRouter = require(`${__dirname}/routes/tours`);
const usersRouter = require(`${__dirname}/routes/users`);

const app = express();

const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes)
  windowMs: H.getMilisecondsFromMinutes(60),
  message: 'Too many requests. Try again in 1 hour.'
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  // legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// middleware
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
