const fs = require('fs');
const express = require('express');

const K = require(`${__dirname}/misc/constants`);
const app = express();

// middleware
app.use(express.json());

const tourFilePath = `${__dirname}/dev-data/data/tours-simple.json`;
const toursJSONData = JSON.parse(fs.readFileSync(tourFilePath));

// Route handler - callback function that handle route request
const Routes = {
  v1: {
    tours: `/api/${K.versions.v1}/tours`,
    tourById: `/api/${K.versions.v1}/tours/:id`,
  },
};
app.post(Routes.v1.tours, (req, res) => {
  const newTourItemId = toursJSONData[toursJSONData.length - 1].id + 1;
  const newTourItem = Object.assign({ id: newTourItemId }, req.body);
  console.log('❗ > newTourItem', newTourItem);

  toursJSONData.push(newTourItem);
  const jsonString = JSON.stringify(toursJSONData);
  fs.writeFile(tourFilePath, jsonString, (err) => {
    console.log('❗ > err', err);

    res.status(201).json({
      status: K.status.success,
      data: {
        tour: newTourItem,
      },
    });
  });
});

app.get(Routes.v1.tours, (req, res) => {
  res.status(200).json({
    status: K.status.success,
    count: toursJSONData.length,
    data: {
      tours: toursJSONData,
    },
  });
});

app.get(Routes.v1.tourById, (req, res) => {
  const id = parseInt(req.params.id);
  const tourItem = toursJSONData.find((tour) => tour.id === id);

  // if (id > toursJSONData.length) {
  if (!tourItem) {
    return res.status(404).json({
      status: K.status.fail,
      message: `Invalid id: ${id}`,
    });
  }

  res.status(200).json({
    status: K.status.success,
    data: {
      tour: toursJSONData.find((tour) => tour.id === id),
    },
  });
});

app.listen(K.PORT, () => {
  console.log(`${K.APP_NAME} is 🏃🏼‍♂️ at ${K.PORT}...`);
});
