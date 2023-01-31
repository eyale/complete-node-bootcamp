const fs = require('fs');

const API_VERSION = {
  v1: 'v1'
};

const STATUS = {
  success: 'success',
  fail: 'fail',
  error: 'error'
};

const ERROR_TYPE = {
  cast: 'CastError',
  code11000Duplicate: 11000,
  validation: 'ValidationError',
  jsonWebTokenError: 'JsonWebTokenError',
  tokenExpiredError: 'TokenExpiredError'
};

const API_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const ROLES = {
  admin: 'admin',
  user: 'user',
  guide: 'guide',
  leadGuide: 'lead-guide'
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
  API_METHOD,
  ERROR_TYPE,
  ROLES
};
