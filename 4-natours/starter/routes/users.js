const express = require('express');

const userController = require(`${__dirname}/../controllers/users`);
const authController = require(`${__dirname}/../controllers/auth`);

const K = require(`${__dirname}/../misc/constants`);

const router = express.Router();

// router.use('id', H.checkId);

// always CHECK METHOD
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// as far as authController.protect is middleware function
// we are protecting all routes below
router.use(authController.protect);

router.get('/me', userController.getMe, userController.onGet);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateUserInfo', userController.onUpdateUserInfo);
router.delete('/deactivateUser', userController.onDeactivateUser);

// as far as authController.restrictTo is middleware function
// so admin only allowed to make API calls that below
router.use(authController.restrictTo(K.ROLES.admin));

router
  .route('/')
  .get(userController.onGetAll)
  .post(userController.onAddNew);

router
  .route('/:id')
  .get(userController.onGet)
  .patch(userController.onEdit)
  .delete(userController.onDelete);

module.exports = router;
