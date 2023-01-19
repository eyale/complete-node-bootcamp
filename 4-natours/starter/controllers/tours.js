/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants`);
const Tour = require(`${__dirname}/../models/tour`);
const APIFeatures = require(`${__dirname}/../misc/apiFeatures`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError`);

const topFiveCheap = (req, _, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const onGetAll = H.catchAsync(async (req, res, next) => {
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
});

const onGet = H.catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`Tour not found by id: ${id}`, 404));
  }

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      tour
    }
  });
});

const onAddNew = H.catchAsync(async (req, res, next) => {
  const newItem = await Tour.create(req.body);

  res.status(201).json({
    status: K.STATUS.success,
    data: {
      tour: newItem
    }
  });
});

const onEdit = H.catchAsync(async (req, res, next) => {
  const {
    params: { id },
    body: withContent
  } = req;

  const options = { new: true, runValidators: true };
  const tour = await Tour.findByIdAndUpdate(id, withContent, options);

  if (!tour) {
    return next(new AppError(`Tour not found by id: ${id}`, 404));
  }

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      tour
    }
  });
});

const onDelete = H.catchAsync(async (req, res, next) => {
  const {
    params: { id }
  } = req;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError(`Tour not found by id: ${id}`, 404));
  }

  res.status(204).json({
    status: K.STATUS.success,
    data: null
  });
});

const getTourStats = H.catchAsync(async (_, res, next) => {
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
});

const getMonthlyPlan = H.catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const unwindAggr = { $unwind: '$startDates' };
  const matchAggr = {
    $match: {
      startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    }
  };
  const groupAggr = {
    $group: {
      _id: { $month: '$startDates' },
      toursStartCount: { $sum: 1 },
      tours: { $push: '$name' }
    }
  };
  const addFieldsAggr = {
    $addFields: { month: '$_id' }
  };
  const reduceIdAggr = {
    $project: {
      _id: 0
    }
  };
  const sortAggr = {
    $sort: {
      toursStartCount: -1
    }
  };
  const limitAggr = {
    $limit: 7
  };

  const plan = await Tour.aggregate([
    unwindAggr,
    matchAggr,
    groupAggr,
    addFieldsAggr,
    reduceIdAggr,
    sortAggr,
    limitAggr
  ]);

  res.status(200).json({
    status: K.STATUS.success,
    data: { plan }
  });
});

module.exports = {
  topFiveCheap,
  onGetAll,
  onGet,
  onAddNew,
  onEdit,
  onDelete,
  getTourStats,
  getMonthlyPlan
};
