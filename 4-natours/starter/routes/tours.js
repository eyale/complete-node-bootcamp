const express = require('express');

const controller = require(`${__dirname}/../controllers/tours`);
const authController = require(`${__dirname}/../controllers/auth`);

const reviewRouter = require(`${__dirname}/reviews`);

// const H = require(`${__dirname}/../misc/helpers`);
const K = require(`${__dirname}/../misc/constants`);

const router = express.Router();
// router.param('id', H.checkId);

// mounting router
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(controller.topFiveCheap, controller.onGetAll);

router.route('/tour-stats').get(controller.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    controller.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(controller.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(controller.getDistances);

router
  .route('/')
  .get(controller.onGetAll)
  .post(
    authController.protect,
    authController.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    controller.onAddNew
  );

router
  .route('/:id')
  .get(controller.onGet)
  .patch(
    authController.protect,
    authController.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    controller.onEdit
  )
  .delete(
    authController.protect,
    authController.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    controller.onDelete
  );

module.exports = router;
