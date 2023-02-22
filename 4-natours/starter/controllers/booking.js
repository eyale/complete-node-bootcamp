/**
 *
 * CONTROLLER Booking
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const K = require(`${__dirname}/../misc/constants`);
const H = require(`${__dirname}/../misc/helpers`);
// const handlerFactory = require(`${__dirname}/handlerFactory`);
const AppError = require(`${__dirname}/../misc/appError`);

const Booking = require(`${__dirname}/../models/booking`);
const Tour = require(`${__dirname}/../models/tour`);

const getCheckoutSession = H.catchAsync(async (req, res, next) => {
  if (!req.params.tourId) {
    return next(new AppError(`Request should contain tourId`, 400));
  }

  const tour = await Tour.findById(req.params.tourId);
  console.log('🪬 - tour', tour);

  const url = `${req.protocol}://${K.getHostFrom(req)}`;
  const successUrl = `${url}/?tour=${tour.id}&user=${req.user.id}&price=${
    tour.price
  }`;
  console.log('🪬 - successUrl', successUrl);

  const options = {
    //session info
    payment_method_types: ['card'],
    //product info
    success_url: successUrl,
    cancel_url: `${url}/tour/${tour.slug}`,
    client_reference_id: req.params.tourId,
    customer_email: req.user.email,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} tour`,
            description: tour.summary,
            images: [`${url}/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100
        },
        quantity: 1
      }
    ]
  };

  const session = await stripe.checkout.sessions.create(options);
  console.log('🪬 - Strapi session\n', session);

  res.status(200).json({
    status: K.STATUS.success,
    data: { session }
  });
});

const createBookingCheckout = H.catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }

  const bookingItem = await Booking.create({
    tour,
    user,
    price
  });
  console.log('🕎 bookingItem', bookingItem);

  res.redirect(req.originalUrl.split('?')[0]);
});

module.exports = {
  getCheckoutSession,
  createBookingCheckout
};
