const express = require('express');

const toursC = require(`${__dirname}/../controllers/tours`);
const authC = require(`${__dirname}/../controllers/auth`);

const reviewRouter = require(`${__dirname}/reviews`);

// const H = require(`${__dirname}/../misc/helpers`);
const K = require(`${__dirname}/../misc/constants`);

const router = express.Router();
// router.param('id', H.checkId);

// mounting router
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(toursC.topFiveCheap, toursC.onGetAll);

router.route('/tour-stats').get(toursC.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authC.protect,
    authC.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    toursC.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursC.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(toursC.getDistances);

router
  .route('/')
  .get(toursC.onGetAll)
  .post(
    authC.protect,
    authC.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    toursC.onAddNew
  );

router
  .route('/:id')
  .get(toursC.onGet)
  .patch(
    authC.protect,
    authC.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    toursC.uploadTourImages,
    toursC.resizeTourImages,
    toursC.onEdit
  )
  .delete(
    authC.protect,
    authC.restrictTo(K.ROLES.admin, K.ROLES.leadGuide),
    toursC.onDelete
  );

module.exports = router;
