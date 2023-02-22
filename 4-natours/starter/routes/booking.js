const express = require('express');

const bookingC = require(`${__dirname}/../controllers/booking`);
const authC = require(`${__dirname}/../controllers/auth`);
const K = require(`${__dirname}/../misc/constants`);
const router = express.Router({ mergeParams: true });

router.use(authC.protect);

router.get('/checkout-session/:tourId', bookingC.getCheckoutSession);

router.use(authC.restrictTo(K.ROLES.admin, K.ROLES.leadGuide));

router
  .route('/')
  .get(bookingC.onGetAll)
  .post(bookingC.onAddNew);

router
  .route('/:id')
  .get(bookingC.onGet)
  .patch(bookingC.onEdit)
  .delete(bookingC.onDelete);

module.exports = router;
