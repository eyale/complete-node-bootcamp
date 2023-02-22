/**
 *
 * CONTROLLER views
 */

const Tour = require('../models/tour');
const User = require('../models/user');
const Booking = require('../models/booking');
const H = require('../misc/helpers');

const AppError = require(`${__dirname}/../misc/appError`);

exports.getOverview = H.catchAsync(async (req, res) => {
  // get data from collection
  const tours = await Tour.find();

  // build template
  // render template
  res.status(200).render('overview', {
    title: 'All Tours',
    data: { tours }
  });
});

exports.getTour = H.catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user'
  });

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    data: { tour }
  });
});

exports.login = H.catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
});

exports.me = H.catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Me'
  });
});

exports.updateUserData = H.catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true }
  );

  res.status(200).render('account', {
    title: 'User',
    user
  });
  next();
});

exports.getMyTours = H.catchAsync(async (req, res, next) => {
  // find all bookings
  const booking = await Booking.find({ user: req.user.id });
  // find tours with id's
  const tourIDs = booking.map(item => item.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My tours',
    data: { tours }
  });
});
