/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants.js`);
const Tour = require(`${__dirname}/../models/tour.js`);
const APIFeatures = require(`${__dirname}/../misc/apiFeatures.js`);

const topFiveCheap = (req, _, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const onGetAll = async (req, res) => {
  try {
    const count = await Tour.countDocuments();
    // 5 EXECUTE query
    const apiFeatures = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitProperties()
      .paginate();
    const tours = await apiFeatures.query;

    // 6 SEND response
    res.status(200).json({
      status: K.STATUS.success,
      requestedAt: req.requestedAt,
      data: {
        count,
        tours: tours
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: `Error: ${error.message}`
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

const getTourStats = async (_, res) => {
  try {
    const matchAggr = { $match: { ratingsAverage: { $gte: 4.5 } } };
    const groupAggr = {
      $group: {
        // _id: null,
        // _id: '$difficulty', // for each difficulty
        _id: { $toUpper: '$difficulty' }, // uppercase prop
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    };
    const sortAggr = { $sort: { avgPrice: 1 } };
    // const matchAllExceptEasy = { $match: { _id: { $ne: 'EASY' } } };

    const stats = await Tour.aggregate([
      matchAggr,
      groupAggr,
      sortAggr
      /*, matchAllExceptEasy */
    ]);

    res.status(200).json({
      status: K.STATUS.success,
      data: { stats }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.error,
      message: `Error: ${error.message}`
    });
  }
};

module.exports = {
  topFiveCheap,
  onGetAll,
  onGet,
  onAddNew,
  onEdit,
  onDelete,
  getTourStats
};
