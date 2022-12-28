const fs = require('fs');
const express = require('express');

const K = require(`${__dirname}/misc/constants`);
const helpers = require(`${__dirname}/misc/helpers`);
const routeHandlers = require(`${__dirname}/misc/routeHandlers`);
const app = express();

// middleware
helpers.applyMiddlewares(app);

const onAppStart = () => {
  console.log(`${K.APP_NAME} is 🏃🏼‍♂️ at ${K.PORT}...`);
};

/**
 * TOURS
 */
app
  .route(K.ROUTES.v1.tours)
  .get(routeHandlers.onGetAllTours)
  .post(routeHandlers.onAddNewTour);

app
  .route(K.ROUTES.v1.tourById)
  .get(routeHandlers.onGetTourById)
  .patch(routeHandlers.onEditTour)
  .delete(routeHandlers.onDeleteTour);

/**
 * USERS
 */
// app.route(K.ROUTES.v1.users).get();

/**
 * START APP
 */
app.listen(K.PORT, onAppStart);
