/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants.js`);
const Tour = require(`${__dirname}/../models/tour.js`);

const onGetAll = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: K.STATUS.success,
      requestedAt: req.requestedAt,
      count: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: 'Error'
    });
  }
};

const onGet = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: K.STATUS.success,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: 'Error'
    });
  }
};

const onAddNew = async (req, res) => {
  try {
    const newItem = await Tour.create(req.body);

    res.status(201).json({
      status: K.STATUS.success,
      data: {
        tour: newItem
      }
    });
  } catch (error) {
    console.log('❗ > `error', error);
    res.status(400).json({
      status: K.STATUS.fail,
      message: `Invalid data send`
    });
  }
};

const onEdit = (req, res) => {
  const id = parseInt(req.params.id, 10);
  // const tour = K.toursData.find(item => item.id === id);

  res.status(200).json({
    status: K.STATUS.success,
    tour: 'Update tour...'
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
