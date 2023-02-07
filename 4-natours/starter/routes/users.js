const express = require('express');

const userController = require(`${__dirname}/../controllers/users`);
const authController = require(`${__dirname}/../controllers/auth`);

const router = express.Router();

// router.use('id', H.checkId);

// always CHECK METHOD
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch(
  '/updateUserInfo',
  authController.protect,
  userController.onUpdateUserInfo
);
router.delete(
  '/deactivateUser',
  authController.protect,
  userController.onDeactivateUser
);

router
  .route('/')
  .get(authController.protect, userController.onGetAll)
  .post(userController.onAddNew);

router
  .route('/:id')
  .get(authController.protect, userController.onGet)
  .patch(userController.onEdit)
  .delete(userController.onDelete);

module.exports = router;
