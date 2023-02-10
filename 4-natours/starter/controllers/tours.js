/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const handlerFactory = require(`${__dirname}/handlerFactory`);
const AppError = require(`${__dirname}/../misc/appError`);

const Tour = require(`${__dirname}/../models/tour`);

const topFiveCheap = (req, _, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// const onGetAll = H.catchAsync(async (req, res, next) => {
//   const count = await Tour.countDocuments();
//   // 5 EXECUTE query
//   const apiFeatures = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitProperties()
//     .paginate();
//   const tours = await apiFeatures.query;

//   // 6 SEND response
//   res.status(200).json({
//     status: K.STATUS.success,
//     requestedAt: req.requestedAt,
//     data: {
//       count,
//       tours: tours
//     }
//   });
// });

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

const getRadiusRadiance = (unit, distance) => {
  return unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
};

const getToursWithin = H.catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    return next(
      new AppError(
        `Server should receive coordinates lat: ${lat}, lng: ${lng}`,
        400
      )
    );
  }

  const radius = getRadiusRadiance(unit, distance);
  // https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/#mongodb-query-op.-geoWithin
  const findOptions = {
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  };

  const tours = await Tour.find(findOptions);

  res.status(200).json({
    status: K.STATUS.success,
    count: tours.length,
    data: {
      tours
    }
  });
});

const getDistances = H.catchAsync(async (req, res, next) => {
  // {{URL}}/api/v1/tours/distances/:latlng/unit/:unit
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    return next(
      new AppError(
        `Server should receive coordinates lat: ${lat}, lng: ${lng}`,
        400
      )
    );
  }

  const multiplier = unit === 'mi' ? 0.00062137 : 0.001;

  const geoOpt = {
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [lng * 1, lat * 1]
      },
      distanceField: 'distance',
      distanceMultiplier: multiplier
    }
  };
  const keepOnlyDistanceOpt = {
    $project: {
      distance: 1,
      name: 1
    }
  };

  const distances = await Tour.aggregate([geoOpt, keepOnlyDistanceOpt]);

  res.status(200).json({
    status: K.STATUS.success,
    count: distances.length,
    data: {
      distances
    }
  });
});

module.exports = {
  topFiveCheap,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  onGetAll: handlerFactory.getAll(Tour),
  onGet: handlerFactory.getOne(Tour, { path: 'reviews' }),
  onAddNew: handlerFactory.createOne(Tour),
  onEdit: handlerFactory.updateOne(Tour),
  onDelete: handlerFactory.deleteOne(Tour)
};
