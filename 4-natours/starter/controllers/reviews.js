/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError`);
const handlerFactory = require(`${__dirname}/handlerFactory`);

const Review = require(`${__dirname}/../models/review`);
const Tour = require(`${__dirname}/../models/Tour`);

const onGetAll = H.catchAsync(async (req, res, next) => {
  const filterOptions = req.params.tourId ? { tour: req.params.tourId } : {};

  const reviews = await Review.find(filterOptions);

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      count: reviews.length,
      reviews
    }
  });
});

const onAddReview = H.catchAsync(async (req, res, next) => {
  // Allow nested routes
  // if (!req.body.tour) {
  //   req.body.tour = req.params.tourId;
  // }
  // if (!req.body.user) {
  //   req.body.user = req.user.id;
  // }
  const { review, rating } = req.body;
  const tourId = req.body.tourId || req.params.tourId;

  if (!review || !rating) {
    const error = new AppError(
      `There is no required data. "review": ${review}, rating: ${rating}`,
      400
    );

    return next(error);
  }

  if (!tourId) {
    const error = new AppError(`Request should contain tourId`, 400);

    return next(error);
  }

  const newReview = await Review.create({
    review,
    rating,
    tour: tourId,
    user: req.user.id
  });

  res.status(201).json({
    status: K.STATUS.success,
    data: {
      review: newReview
    }
  });
});

const onUpdateReview = H.catchAsync(async (req, res, next) => {
  const { review, rating, tourId } = req.body;
  if (!review || !rating) {
    const error = new AppError(
      `There is no required data. "review": ${review}, rating: ${rating}`,
      400
    );

    return next(error);
  }

  if (!tourId) {
    const error = new AppError(`Request should contain tourId`, 400);

    return next(error);
  }

  const updatedObject = { review, rating };
  const tour = await Tour.findByIdAndUpdate(tourId, updatedObject, {
    new: true
  });

  tour.save();

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      tour
    }
  });
});

module.exports = {
  onGetAll,
  onAddReview,
  onUpdateReview,
  onDelete: handlerFactory.deleteOne(Review)
};
