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
    res.status(400).json({
      status: K.STATUS.fail,
      message: error
    });
  }
};

const onEdit = async (req, res) => {
  try {
    const {
      params: { id },
      body: withContent
    } = req;

    const options = { new: true, runValidators: true };
    const tour = await Tour.findByIdAndUpdate(id, withContent, options);

    res.status(200).json({
      status: K.STATUS.success,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: `Invalid data send`
    });
  }
  // const tour = K.toursData.find(item => item.id === id);

  res.status(200).json({
    status: K.STATUS.success,
    tour: 'Update tour...'
  });
};

const onDelete = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;

    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: K.STATUS.success,
      data: null
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.error,
      message: 'Invalid data send'
    });
  }
};

module.exports = {
  onGetAll,
  onGet,
  onAddNew,
  onEdit,
  onDelete
};
