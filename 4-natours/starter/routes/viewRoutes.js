const express = require('express');

const viewC = require(`${__dirname}/../controllers/views`);
const authC = require(`${__dirname}/../controllers/auth`);
const bookingC = require(`${__dirname}/../controllers/booking`);

const router = express.Router();

router.get(
  '/',
  bookingC.createBookingCheckout,
  authC.handleLoggedUser,
  viewC.getOverview
);
router.get('/tour/:slug', authC.handleLoggedUser, viewC.getTour);
router.get('/login', authC.handleLoggedUser, viewC.login);
router.get('/me', authC.protect, viewC.me);
router.get('/my-tours', authC.protect, viewC.getMyTours);

router.post('/submit-user-data', authC.protect, viewC.updateUserData);

module.exports = router;
