const fs = require('fs');

const K = require(`${__dirname}/../misc/constants.js`);

const onGetAll = (req, res) => {
  res.status(200).json({
    status: K.STATUS.success,
    requestedAt: req.requestedAt,
    count: K.toursData.length,
    data: {
      tours: K.toursData
    }
  });
};

const onGet = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = K.toursData.find(item => item.id === id);

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      tour
    }
  });
};

const onAddNew = (req, res) => {
  const newItemId = K.toursData[K.toursData.length - 1].id + 1;
  const newItem = Object.assign({ id: newItemId }, req.body);

  K.toursData.push(newItem);
  const jsonString = JSON.stringify(K.toursData);
  fs.writeFile(K.tourFilePath, jsonString, _ => {
    res.status(201).json({
      status: K.STATUS.success,
      data: {
        tour: newItem
      }
    });
  });
};

const onEdit = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = K.toursData.find(item => item.id === id);

  res.status(200).json({
    tour: tour
  });
};

const onDelete = (req, res) => {
  res.status(204).json({
    status: K.STATUS.success,
    data: null
  });
};

module.exports = {
  onGetAll,
  onGet,
  onAddNew,
  onEdit,
  onDelete
};
