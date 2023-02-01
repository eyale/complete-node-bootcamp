/**
 *
 *
 * ENTRY POINT OF THE APP
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const helpers = require(`${__dirname}/misc/helpers`);
const port = 8000;
const K = require(`${__dirname}/misc/constants.js`);

process.on('uncaughtException', helpers.uncaughtException);

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

const server = app.listen(port, () => {
  console.log(
    '\x1b[43m%s\x1b[0m',
    `📲 ${K.APP_NAME} is running on port: ${port}`
  );
});

process.on('unhandledRejection', err => {
  helpers.unhandledRejection(server, err);
});
