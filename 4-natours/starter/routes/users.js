const express = require('express');

// const H = require(`${__dirname}/../misc/helpers.js`);

const userController = require(`${__dirname}/../controllers/users.js`);
const authController = require(`${__dirname}/../controllers/auth.js`);

const router = express.Router();
// router.use('id', H.checkId);

router.post('/signup', authController.signupAsync);
router.post('/login', authController.login);

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
