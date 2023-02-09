const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require(`${__dirname}/../../models/tour.js`);
const Review = require(`${__dirname}/../../models/review.js`);
const User = require(`${__dirname}/../../models/user.js`);

const helpers = require(`${__dirname}/../../misc/helpers.js`);

const ARGV = {
  import: '--import',
  delete: '--delete'
};

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

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// import tours to DB
const importToDB = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    console.log(
      '❗️❗️❗️ comment PASSWORD ENCRYPTION at `/models/user.js` ❗️❗️❗️'
    );
    await User.create(users, { validateBeforeSave: false });
    console.log('✅SUCCESS: importToursToDB');
  } catch (error) {
    console.log(`❌importToursToDB err:\n${error}`);
  }
  process.exit();
};

// Delete all data from DB
const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('✅SUCCESS: deleteAllData');
  } catch (error) {
    console.log('❌deleteAllData err:\n', error);
  }
  process.exit();
};

if (process.argv[2] === ARGV.import) {
  importToDB();
}
if (process.argv[2] === ARGV.delete) {
  deleteAllData();
}

console.log(process.argv);
