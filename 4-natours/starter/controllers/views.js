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
  console.log('🤖  tour', tour, '\n');
  // req the tour - along with reviews and tourguides
  // build template
  // render template using data

  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    data: { tour }
  });
});
