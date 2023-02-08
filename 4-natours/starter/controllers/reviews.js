/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError`);
const handlerFactory = require(`${__dirname}/handlerFactory`);

const Review = require(`${__dirname}/../models/review`);

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

const setTourAndUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  next();
};

module.exports = {
  onGetAll,
  onAddReview: handlerFactory.createOne(Review),
  onUpdateReview: handlerFactory.updateOne(Review),
  onDelete: handlerFactory.deleteOne(Review),
  setTourAndUserIds
};
