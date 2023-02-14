const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const K = require(`${__dirname}/misc/constants`);
const H = require(`${__dirname}/misc/helpers`);
const errorController = require(`${__dirname}/controllers/error`);
const toursRouter = require(`${__dirname}/routes/tours`);
const reviewsRouter = require(`${__dirname}/routes/reviews`);
const usersRouter = require(`${__dirname}/routes/users`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);

const app = express();

// middleware
// Data sanitization against NoSQL query injection
// Data sanitization against XSS
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}
app.use('/api', H.limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: K.allowedPropertiesToDuplicate
  })
);
H.applyMiddlewares(app);

// setup template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * ROUTES
 */
app.use(K.ROUTES.root, viewRouter);

/**
 * TOURS
 */
app.use(K.ROUTES.v1.tours, toursRouter);
/**
 * REVIEWS
 */
app.use(K.ROUTES.v1.reviews, reviewsRouter);
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
