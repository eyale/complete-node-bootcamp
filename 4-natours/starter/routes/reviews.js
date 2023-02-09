const express = require('express');

const reviewController = require(`${__dirname}/../controllers/reviews`);
const authController = require(`${__dirname}/../controllers/auth`);
const K = require(`${__dirname}/../misc/constants`);

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.onGetAll)
  .post(
    authController.restrictTo(K.ROLES.user),
    reviewController.setTourAndUserIds,
    reviewController.onAddReview
  );

router
  .route('/:id')
  .get(reviewController.onGetReview)
  .patch(
    authController.restrictTo(K.ROLES.user, K.ROLES.admin),
    reviewController.onUpdateReview
  )
  .delete(
    authController.restrictTo(K.ROLES.user, K.ROLES.admin),
    reviewController.onDelete
  );

module.exports = router;
