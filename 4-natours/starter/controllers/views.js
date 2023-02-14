/**
 *
 * CONTROLLER views
 */

const Tour = require('../models/tour');
const H = require('../misc/helpers');

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

exports.getTour = H.catchAsync(async (req, res) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review, rating, user'
  });

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
