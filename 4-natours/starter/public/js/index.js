/* eslint-disable no-undef */
import '@babel/polyfill';
import { login, logout } from './login';
import mapBoxInit from './mapbox';

console.log('📦 parcel is watching...\n');

window.addEventListener('load', () => {
  // LOGIN
  if (document.querySelector('.form')) {
    document.querySelector('.form').addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
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
