/**
 *
 * User controller
 */

const jwt = require('jsonwebtoken');

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);

const User = require('../models/user');

const signupAsync = H.catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: K.STATUS.success,
    token,
    data: { user: newUser }
  });
});

module.exports = {
  signupAsync
};
