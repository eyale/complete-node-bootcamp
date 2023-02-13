const Tour = require('../models/tour');
const H = require('../misc/helpers');

exports.getOverview = H.catchAsync(async (req, res) => {
  // get data from collection
  const tours = await Tour.find();

  // build template
  // render template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};
