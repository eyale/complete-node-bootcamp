const express = require('express');

const userC = require(`${__dirname}/../controllers/users`);
const authC = require(`${__dirname}/../controllers/auth`);

const K = require(`${__dirname}/../misc/constants`);

const router = express.Router();

// router.use('id', H.checkId);

// always CHECK METHOD
router.post('/signup', authC.signup);
router.post('/login', authC.login);
router.get('/logout', authC.logout);

// as far as authC.protect is middleware function
// we are protecting all routes below
router.use(authC.protect);

router.get('/me', userC.getMe, userC.onGet);

router.post('/forgotPassword', authC.forgotPassword);
router.patch('/resetPassword/:token', authC.resetPassword);
router.patch('/updatePassword', authC.updatePassword);
router.patch(
  '/updateUserInfo',
  userC.uploadUserPhoto,
  userC.resizeImage,
  userC.onUpdateUserInfo
);
router.delete('/deactivateUser', userC.onDeactivateUser);

// as far as authC.restrictTo is middleware function
// so admin only allowed to make API calls that below
router.use(authC.restrictTo(K.ROLES.admin));

router
  .route('/')
  .get(userC.onGetAll)
  .post(userC.onAddNew);

router
  .route('/:id')
  .get(userC.onGet)
  .patch(userC.onEdit)
  .delete(userC.onDelete);

module.exports = router;
