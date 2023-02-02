const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);

const User = require('../models/user');

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

const onDeleteUser = (req, res) => {
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
  onDelete: onDeleteUser
};
