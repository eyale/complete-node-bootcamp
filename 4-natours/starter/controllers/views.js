exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'The Forest Hiker Tour'
  });
};
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'All Tours'
  });
};
