const K = require(`${__dirname}/../misc/constants.js`);

const onGetAllUsers = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction',
  });
};

const onGetUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction',
  });
};

const onAddNewUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction',
  });
};

const onEditUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction',
  });
};

const onDeleteUser = (req, res) => {
  res.status(500).json({
    status: K.STATUS.fail,
    message: 'Route is under construction',
  });
};

module.exports = {
  onGetAll: onGetAllUsers,
  onGet: onGetUser,
  onAddNew: onAddNewUser,
  onEdit: onEditUser,
  onDelete: onDeleteUser,
};
