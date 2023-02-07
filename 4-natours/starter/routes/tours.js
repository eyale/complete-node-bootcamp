const express = require('express');

const controller = require(`${__dirname}/../controllers/tours`);
const authController = require(`${__dirname}/../controllers/auth`);
// const H = require(`${__dirname}/../misc/helpers`);
const K = require(`${__dirname}/../misc/constants`);

const router = express.Router();
// router.param('id', H.checkId);

router.route('/top-5-cheap').get(controller.topFiveCheap, controller.onGetAll);

router.route('/tour-stats').get(controller.getTourStats);
router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, controller.onGetAll)
  .post(controller.onAddNew);

router
  .route('/:id')
  .get(controller.onGet)
  .patch(controller.onEdit)
  .delete(
    authController.protect,
    authController.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    controller.onDelete
  );

module.exports = router;
