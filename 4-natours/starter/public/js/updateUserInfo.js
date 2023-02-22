/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import axios from 'axios';
import showAlert from './alerts';

export const updateUserInfo = async (data, type) => {
  try {
    const url = `/api/v1/users/${
      type === 'password' ? 'updatePassword' : 'updateUserInfo'
    }`;

    await axios({ method: 'PATCH', url, data });

    showAlert('success', `🎉 ${type.toUpperCase()} has been updated.`);

    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.log('🤖  error', error);
    showAlert('error', error.response.data.message);
  }
};
