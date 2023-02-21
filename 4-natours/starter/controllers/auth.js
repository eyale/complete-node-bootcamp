/**
 *
 * Auth controller
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError.js`);
// const { sendEmail } = require(`${__dirname}/../misc/email.js`);
const Email = require(`${__dirname}/../misc/email.js`);
const User = require('../models/user');

const getUsersToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = getUsersToken(user._id);

  const cookieOptions = {
    expires: H.getDays(process.env.JWT_EXPIRES_IN_COOKIE),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.isActive = undefined;

  res.status(statusCode).json({
    status: K.STATUS.success,
    data: {
      token,
      user
    }
  });
};

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

  const host =
    process.env.NODE_ENV === 'production' ? req.get('host') : 'localhost:8000';

  const url = `${req.protocol}://${host}/me`;
  console.log('🪬 - url', url);

  await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, res);
});

const logout = H.catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: K.STATUS.success,
    data: {}
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
  createAndSendToken(user, 200, res);
});

const protect = H.catchAsync(async (req, res, next) => {
  let token;
  // 1 - is token exists
  const isTokenFromHeaders =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer');

  if (isTokenFromHeaders) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = user;
  next();
});

// only for rendered pages
const handleLoggedUser = H.catchAsync(async (req, res, next) => {
  res.locals.MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  if (req.cookies.jwt) {
    try {
      const dataFromDecodedToken = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3 - is user exist
      const user = await User.findById(dataFromDecodedToken.id);
      if (!user) {
        next();
      }
      // 4 - is password not changed
      if (user.checkIsPassChangedAfterTokenReceived(dataFromDecodedToken.iat)) {
        next();
      }
      res.locals.user = user;
      return next();
    } catch (error) {
      return next();
    }
  }
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
  try {
    const host =
      process.env.NODE_ENV === 'production'
        ? req.get('host')
        : 'localhost:8000';
    const resetURL = `${
      req.protocol
    }://${host}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendForgotPassword();

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

const resetPassword = H.catchAsync(async (req, res, next) => {
  // 1 - find user by token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const findOptions = {
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  };
  const user = await User.findOne(findOptions);

  // 2 - token exp > now() && user => setNewPassword
  if (!user) {
    return next(new AppError(`User not found: invalid or expired token`, 404));
  }

  if (!req.body.password || !req.body.confirmPassword) {
    return next(
      new AppError(
        `Invalid data. Password: ${req.body.password}, confirmPassword: ${
          req.body.confirmPassword
        }`,
        404
      )
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3 - user.changePasswordAt = new Date()
  // 4 - send JWT token in response
  createAndSendToken(user, 200, res);
});

const updatePassword = H.catchAsync(async (req, res, next) => {
  const { password, passwordNew, confirmNewPassword } = req.body;

  // 3 - is user exist
  const user = await User.findById(req.user.id).select('+password');
  // 1 - find User
  // 2 - is req.body.password is correct
  const isPasswordCorrect = await user.checkIsPasswordMatched(
    password,
    user.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid password'), 404);
  }
  // 3 - update password
  user.password = passwordNew;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  // 4 - Log in user, send JWT
  createAndSendToken(user, 200, res);
});

module.exports = {
  signup,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  login,
  logout,
  handleLoggedUser
};
