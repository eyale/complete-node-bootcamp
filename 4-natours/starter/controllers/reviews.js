/**
 *
 * CONTROLLER Tours
 */

// const K = require(`${__dirname}/../misc/constants`);
// const H = require(`${__dirname}/../misc/helpers`);
const handlerFactory = require(`${__dirname}/handlerFactory`);

const Review = require(`${__dirname}/../models/review`);

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
  onGetAll: handlerFactory.getAll(Review),
  onGetReview: handlerFactory.getOne(Review),
  onAddReview: handlerFactory.createOne(Review),
  onUpdateReview: handlerFactory.updateOne(Review),
  onDelete: handlerFactory.deleteOne(Review),
  setTourAndUserIds
};
