const fs = require('fs');
const path = require('path');

const API_VERSION = {
  v1: 'v1',
};

const STATUS = {
  success: 'success',
  fail: 'fail',
};

const ROUTES = {
  v1: {
    tours: `/api/${API_VERSION.v1}/tours`,
    users: `/api/${API_VERSION.v1}/users`,
  },
};

const tourFilePath = `${__dirname}/../dev-data/data/tours-simple.json`;
const toursData = JSON.parse(fs.readFileSync(tourFilePath));

module.exports = {
  APP_NAME: 'Natours',
  PORT: 3000,
  API_VERSION,
  STATUS,
  ROUTES,
  tourFilePath,
  toursData,
};
