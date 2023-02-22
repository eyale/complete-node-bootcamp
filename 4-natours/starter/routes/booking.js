const express = require('express');

const bookingC = require(`${__dirname}/../controllers/booking`);
const authC = require(`${__dirname}/../controllers/auth`);

const router = express.Router({ mergeParams: true });

router.use(authC.protect);

router.get('/checkout-session/:tourId', bookingC.getCheckoutSession);

module.exports = router;
