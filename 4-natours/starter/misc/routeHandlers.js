const fs = require('fs');

const K = require(`${__dirname}/constants`);

const onGetAllTours = (req, res) => {
  res.status(200).json({
    status: K.STATUS.success,
    requestedAt: req.requestTime,
    count: K.toursData.length,
    data: {
      tours: K.toursData,
    },
  });
};

const onGetTourById = (req, res) => {
  const id = parseInt(req.params.id);
  const tourItem = K.toursData.find((tour) => tour.id === id);

  // if (id > K.toursData.length) {
  if (!tourItem) {
    return res.status(404).json({
      status: K.STATUS.fail,
      message: `Invalid id: ${id}`,
    });
  }

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      tour: K.toursData.find((tour) => tour.id === id),
    },
  });
};

const onAddNewTour = (req, res) => {
  const newItemId = K.toursData[K.toursData.length - 1].id + 1;
  const newItem = Object.assign({ id: newItemId }, req.body);

  K.toursData.push(newItem);
  const jsonString = JSON.stringify(K.toursData);
  fs.writeFile(K.tourFilePath, jsonString, (err) => {
    res.status(201).json({
      status: K.STATUS.success,
      data: {
        tour: newItem,
      },
    });
  });
};

const onEditTour = (req, res) => {
  const id = parsTour(req.params.id);
  const tourItem = K.toursData.find((tour) => tour.id === id);

  if (!tourItem) {
    return res.status(404).json({
      status: K.STATUS.fail,
      message: `Invalid id: ${id}`,
    });
  }
  res.status(200).json({
    tour: tourItem,
  });
};

const onDeleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tourItem = K.toursData.find((tour) => tour.id === id);

  if (!tourItem) {
    return res.status(404).json({
      status: K.STATUS.fail,
      message: `Invalid id: ${id}`,
    });
  }

  res.status(204).json({
    status: K.STATUS.success,
    data: null,
  });
};

module.exports = {
  onGetAllTours,
  onGetTourById,
  onAddNewTour,
  onEditTour,
  onDeleteTour,
};
