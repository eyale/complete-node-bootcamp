const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require(`${__dirname}/../../models/tour.js`);

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
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import tours to DB
const importToursToDB = async () => {
  try {
    await Tour.create(tours);
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
    console.log('✅SUCCESS: deleteAllData');
  } catch (error) {
    console.log('❌deleteAllData err:\n', error);
  }
  process.exit();
};

if (process.argv[2] === ARGV.import) {
  importToursToDB();
}
if (process.argv[2] === ARGV.delete) {
  deleteAllData();
}

console.log(process.argv);
