/**
 *
 * Auth controller
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError.js`);
const { sendEmail } = require(`${__dirname}/../misc/email.js`);
const User = require('../models/user');

const getUsersToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const signup = H.catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    passwordChangeAt,
    role
  } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    passwordChangeAt,
    role
  });

  const token = getUsersToken(newUser._id);

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      token,
      user: newUser
    }
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

const protect = H.catchAsync(async (req, res, next) => {
  let token;
  // 1 - is token exists
  const isToken =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');

  if (isToken) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError(`Not authorized`, 401));
  }
  // 2 - validate token
  const dataFromDecodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3 - is user exist
  const user = await User.findById(dataFromDecodedToken.id);
  if (!user) {
    return next(new AppError('Deleted user', 401));
  }
  // 4 - is password not changed
  if (user.checkIsPassChangedAfterTokenReceived(dataFromDecodedToken.iat)) {
    return next(new AppError('Password was changed', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  // user will go to `restrictTo` middleware
  req.user = user;
  next();
});

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`Not Permitted for: ${req.user.role}`), 403);
  }

  next();
};

const forgotPassword = H.catchAsync(async (req, res, next) => {
  // 1 - get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(`User not found: ${req.body.email}`, 404));
  }
  // 2 - generate reset token
  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });

  // 3 - send it to users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? Submit reset password with new password. Confirm to: ${resetURL}.\nIgnore email if it was not you 🤷🏻‍♂️`;
  const subject = 'Your password reset token valid only for 10 min';

  const info = {
    email: user.email,
    subject,
    message
  };

  try {
    await sendEmail(info);

    res.status(200).json({
      status: K.STATUS.success,
      data: {
        message: `Reset token was sent. Please check email: ${user.email}.`
      }
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError(`SEND MAIL error ${error.message}`, 500));
  }
});

const resetPassword = (req, res, next) => {};

module.exports = {
  signup,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  login
};
