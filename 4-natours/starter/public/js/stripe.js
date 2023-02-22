/* eslint-disable no-undef */
import axios from 'axios';

import showAlert from './alerts';

// eslint-disable-next-line import/prefer-default-export
export const bookTour = async (tourId, stripeApiKey) => {
  // get checkout session from API
  try {
    const session = await axios({
      method: 'GET',
      url: `/api/v1/booking/checkout-session/${tourId}`
    });

    const stripe = Stripe(stripeApiKey);
    await stripe.redirectToCheckout({
      sessionId: session.data.data.session.id
    });
    // window.setTimeout(() => {
    //   window.location.assign('/');
    // }, 1500);
    return session;
  } catch (error) {
    showAlert('error', error.response.data.message);
    console.log('❗️  error', error.response.data);
  }
};
