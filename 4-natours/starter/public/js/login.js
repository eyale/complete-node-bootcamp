/* eslint-disable no-undef */
import axios from 'axios';
import showAlert from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: { email, password }
    });

    showAlert('success', `🎉 ${email} logged in.`);
    window.setTimeout(() => {
      window.location.assign('/');
    }, 1500);
  } catch (error) {
    showAlert('error', error.response.data.message);
    console.log('❗️  error', error.response.data);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      window.location.reload(true);
      window.setTimeout(() => {
        window.location.assign('/');
      }, 400);
    }
  } catch (error) {
    showAlert('error', error);
    console.log('😞  error', error);
  }
};
