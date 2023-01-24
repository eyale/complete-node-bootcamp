/**
 *
 *
 * ENTRY POINT OF THE APP
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const helpers = require(`${__dirname}/misc/helpers`);
const port = process.env.PORT || 8000;

dotenv.config({ path: './config.env' });
const app = require(`${__dirname}/app.js`);
const DB_URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const connectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(DB_URI, connectOptions).then(helpers.onMongooseConnect);

const server = app.listen(port, helpers.onAppStart);

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('🧨 Unhandled rejection');

  server.close(() => {
    process.exit(1);
  });
});
