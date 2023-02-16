/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import axios from 'axios';
import showAlert from './alerts';

export const updateUserInfo = async (data, type) => {
  console.log('🤖  data', data);
  try {
    const url = `http://localhost:8000/api/v1/users/${
      type === 'password' ? 'updatePassword' : 'updateUserInfo'
    }`;

    const res = await axios({ method: 'PATCH', url, data });
    console.log('🪬', res);
    showAlert('success', `🎉 ${type.toUpperCase()} has been updated.`);
  } catch (error) {
    console.log('🤖  error', error);
    showAlert('error', error.response.data.message);
  }
};
