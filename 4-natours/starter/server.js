/**
 *
 *
 * ENTRY POINT OF THE APP
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const helpers = require(`${__dirname}/misc/helpers`);
const app = require(`${__dirname}/app.js`);

dotenv.config({ path: './config.env' });
const DB_URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const connectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};
mongoose
  .connect(DB_URI, connectOptions)
  .catch(console.log)
  .then(helpers.onMongooseConnect);

app.listen(process.env.PORT || 8000, helpers.onAppStart);
