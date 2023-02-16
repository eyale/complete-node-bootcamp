/* eslint-disable no-undef */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateUserInfo } from './updateUserInfo';
import mapBoxInit from './mapbox';

console.log('📦 parcel is watching...\n');

window.addEventListener('load', () => {
  // LOGIN
  if (document.querySelector('.form--login')) {
    document.querySelector('.form--login').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }
  // UPDATE USER INFO
  if (document.querySelector('.form-user-data')) {
    document.querySelector('.form-user-data').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;
      updateUserInfo({ name, email }, 'data');
    });
  }
  // UPDATE USER PASSWORD
  if (document.querySelector('.form-user-password')) {
    document
      .querySelector('.form-user-password')
      .addEventListener('submit', async e => {
        e.preventDefault();
        // "password": "testNewPass",
        // "passwordNew": "123456789",
        // "confirmNewPassword": "123456789"
        document.querySelector('.btn--save-password').textContent =
          'Updating ...';
        const password = document.getElementById('password-current').value;
        console.log('🤖  password', password);
        const passwordNew = document.getElementById('password').value;
        const confirmNewPassword = document.getElementById('password-confirm')
          .value;

        await updateUserInfo(
          { password, passwordNew, confirmNewPassword },
          'password'
        );
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';

        document.querySelector('.btn--save-password').textContent =
          'Save Password';
      });
  }

  // LOGOUT
  if (document.querySelector('.nav__el--logout')) {
    document
      .querySelector('.nav__el--logout')
      .addEventListener('click', logout);
  }
  // MAPBOX
  if (document.getElementById('map')) {
    const locations = JSON.parse(
      document.getElementById('map').dataset.locations
    );
    mapBoxInit(locations);
  }
});
