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

const onGetAllUsers = H.catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: K.STATUS.success,
    count: users.length,
    data: {
      users
    }
  });
});

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

const onGetUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction'
  });
};

const onAddNewUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction'
  });
};

const onEditUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction'
  });
};

module.exports = {
  onGetAll: onGetAllUsers,
  onGet: onGetUser,
  onAddNew: onAddNewUser,
  onEdit: onEditUser,
  onDelete: handlerFactory.deleteOne(User),
  onUpdateUserInfo: onUpdateUserInfo,
  onDeactivateUser: onDeactivateUserAccount
};
