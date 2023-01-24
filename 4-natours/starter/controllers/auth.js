/**
 *
 * User controller
 */

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);

const User = require('../models/user');

const signupAsync = H.catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: K.STATUS.success,
    data: { user: newUser }
  });
});

module.exports = {
  signupAsync
};
