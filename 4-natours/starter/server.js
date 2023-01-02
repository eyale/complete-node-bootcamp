/**
 *
 *
 * ENTRY POINT OF THE APP
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const helpers = require(`${__dirname}/misc/helpers`);
const app = require(`${__dirname}/app.js`);
const port = process.env.PORT || 8000;

dotenv.config({ path: './config.env' });
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

mongoose
  .connect(DB_URI, connectOptions)
  .catch(console.log)
  .then(helpers.onMongooseConnect);

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.4,
  price: 497
});

testTour
  .save()
  .then(doc => {
    console.log('TEST TOUR SAVED !!! 💪\n', doc);
  })
  .catch(error => {
    console.log('🧨 error:', error);
  });
app.listen(port, helpers.onAppStart);
