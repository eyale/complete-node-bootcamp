/**
 *
 * User controller
 */

const jwt = require('jsonwebtoken');

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError.js`);
const User = require('../models/user');

const getUsersToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const signupAsync = H.catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });

  const token = getUsersToken(newUser._id);

  res.status(200).json({
    status: K.STATUS.success,
    token,
    data: { user: newUser }
  });
});

const login = H.catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 - if email exists
  if (!email || !password) {
    const message = `Creds are not valid. email:${email}, password:${password}`;
    return next(new AppError(message, 400));
  }

  // 2 - if password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkIsPasswordMatched(password, user.password))) {
    return next(new AppError(`Email or Password is incorrect`, 401));
  }

  // 3 - send token
  const token = getUsersToken(user._id);

  res.status(200).json({
    status: K.STATUS.success,
    data: { token }
  });
});

module.exports = {
  signupAsync,
  login
};
