/* eslint-disable no-undef */
import axios from 'axios';
import showAlert from './alerts';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: { email, password }
    });
    console.log('🪬', res);
    showAlert('success', `🎉 ${email} logged in.`);
    window.setTimeout(() => {
      window.location.assign('/');
    }, 1500);
  } catch (error) {
    showAlert('error', error.response.data.message);
    console.log('❗️  error', error.response.data);
  }
};

export default login;
