const fs = require('fs');

const API_VERSION = {
  v1: 'v1'
};

const STATUS = {
  success: 'success',
  fail: 'fail',
  error: 'error'
};

const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const ROUTES = {
  v1: {
    tours: `/api/${API_VERSION.v1}/tours`,
    users: `/api/${API_VERSION.v1}/users`
  }
};

const tourFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const toursData = JSON.parse(fs.readFileSync(tourFilePath));

module.exports = {
  APP_NAME: 'Natours',
  API_VERSION,
  STATUS,
  ROUTES,
  tourFilePath,
  toursData,
  API_METHOD
};
