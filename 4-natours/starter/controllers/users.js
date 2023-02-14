/**
 *
 * CONTROLLER Users
 */

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError`);
const handlerFactory = require(`${__dirname}/handlerFactory`);

const User = require('../models/user');

const filterBody = (body, ...allowedProperties) => {
  const newBody = {};

  Object.keys(body).forEach(property => {
    if (allowedProperties.includes(property)) {
      newBody[property] = body[property];
    }
  });

  return newBody;
};

const onUpdateUserInfo = H.catchAsync(async (req, res, next) => {
  // 1 - throw error if user POSTs password
  const { password, confirmPassword, ...rest } = req.body;
  if (password || confirmPassword) {
    const error = new AppError(
      'password and confirmPassword are not allowed to update with this route. Use /updatePassword',
      400
    );

    return next(error);
  }
  // 3 - filter request body properties
  const updateFieldsObject = filterBody(rest, 'name', 'email');

  // 2 - update document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateFieldsObject,
    {
      new: true,
      runValidators: true
    }
  );

  await updatedUser.save();

  res.status(200).json({
    status: K.STATUS.success,
    data: {
      user: updatedUser
    }
  });
});

const onDeactivateUserAccount = H.catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: K.STATUS.success
  });
});

const onAddNewUser = (_, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is not defined. Use /signup instead.'
  });
};

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = {
  onGetAll: handlerFactory.getAll(User),
  onGet: handlerFactory.getOne(User),
  // will not update PASSWORD with `onEdit`
  onEdit: handlerFactory.updateOne(User),
  onDelete: handlerFactory.deleteOne(User),
  onUpdateUserInfo: onUpdateUserInfo,
  onDeactivateUser: onDeactivateUserAccount,
  onAddNew: onAddNewUser,
  getMe
};
