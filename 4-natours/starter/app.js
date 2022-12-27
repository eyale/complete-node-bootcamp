const fs = require('fs');
const express = require('express');

const K = require(`${__dirname}/misc/constants`);
const app = express();

// middleware
app.use(express.json());

const tourFilePath = `${__dirname}/dev-data/data/tours-simple.json`;
const toursData = JSON.parse(fs.readFileSync(tourFilePath));

// Route handler - callback function that handle route request
const Routes = {
  v1: {
    tours: `/api/${K.versions.v1}/tours`,
    tourById: `/api/${K.versions.v1}/tours/:id`,
  },
};

const onAppStart = () => {
  console.log(`${K.APP_NAME} is 🏃🏼‍♂️ at ${K.PORT}...`);
};

const onGetAllItems = (req, res) => {
  res.status(200).json({
    status: K.status.success,
    count: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

const onGetItemById = (req, res) => {
  const id = parseInt(req.params.id);
  const tourItem = toursData.find((tour) => tour.id === id);

  // if (id > toursData.length) {
  if (!tourItem) {
    return res.status(404).json({
      status: K.status.fail,
      message: `Invalid id: ${id}`,
    });
  }

  res.status(200).json({
    status: K.status.success,
    data: {
      tour: toursData.find((tour) => tour.id === id),
    },
  });
};

const onAddNewItem = (req, res) => {
  const newItemId = toursData[toursData.length - 1].id + 1;
  const newItem = Object.assign({ id: newItemId }, req.body);

  toursData.push(newItem);
  const jsonString = JSON.stringify(toursData);
  fs.writeFile(tourFilePath, jsonString, (err) => {
    res.status(201).json({
      status: K.status.success,
      data: {
        tour: newItem,
      },
    });
  });
};

const onEditItem = (req, res) => {
  const id = parseInt(req.params.id);
  const tourItem = toursData.find((tour) => tour.id === id);

  if (!tourItem) {
    return res.status(404).json({
      status: K.status.fail,
      message: `Invalid id: ${id}`,
    });
  }
  res.status(200).json({
    tour: tourItem,
  });
};

const onDeleteItem = (req, res) => {
  const id = parseInt(req.params.id);
  const tourItem = toursData.find((tour) => tour.id === id);

  if (!tourItem) {
    return res.status(404).json({
      status: K.status.fail,
      message: `Invalid id: ${id}`,
    });
  }

  res.status(204).json({
    status: K.status.success,
    data: null,
  });
};

app.route(Routes.v1.tours).get(onGetAllItems).post(onAddNewItem);
app
  .route(Routes.v1.tourById)
  .get(onGetItemById)
  .patch(onEditItem)
  .delete(onDeleteItem);

app.listen(K.PORT, onAppStart);
