/**
 *
 * CONTROLLER Users
 */
const multer = require('multer');
const sharp = require('sharp');

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError`);
const handlerFactory = require(`${__dirname}/handlerFactory`);

const User = require('../models/user');

// ********************* UPLOAD IMAGE *****************

const filePathForPhotos = 'public/img/users';
// ⬇️⬇️⬇️ Uncomment if you NO need image processing
// multerStorage and middleware resizeImage should be commented
// const multerStorage = multer.diskStorage({
//   destination: (req, file, nextCallback) => {
//     nextCallback(null, filePathForPhotos);
//   },
//   filename: (req, file, nextCallback) => {
//     //user-${iserId}-${timestamp}.jpeg
//     const ext = file.mimetype.split('/')[1];

//     nextCallback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, nextCallback) => {
  // for all kinds of files
  // but we need photos now
  if (file.mimetype.startsWith('image')) {
    nextCallback(null, true);
  } else {
    nextCallback(new AppError('Only image can be uploaded', 400), false);
  }
};

const resizeImage = H.catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${filePathForPhotos}/${req.file.filename}`);

  next();
});

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadUserPhoto = upload.single('photo');
// ********************* UPLOAD IMAGE *****************

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
  console.log('📁 ', req.file);
  console.log('👽 ', req.body);

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
  if (req.file) {
    updateFieldsObject.photo = req.file.filename;
  }

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
  getMe,
  resizeImage,
  uploadUserPhoto
};
