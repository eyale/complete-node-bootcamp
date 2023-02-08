const express = require('express');

const reviewController = require(`${__dirname}/../controllers/reviews`);
const authController = require(`${__dirname}/../controllers/auth`);
const K = require(`${__dirname}/../misc/constants`);

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.onGetAll)
  .post(
    authController.protect,
    authController.restrictTo(K.ROLES.user),
    reviewController.onAddReview
  );

router
  .route('/:tourId')
  .patch(authController.protect, reviewController.onUpdateReview);

router.route('/:id').delete(authController.protect, reviewController.onDelete);

module.exports = router;
