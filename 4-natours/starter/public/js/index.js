/* eslint-disable no-undef */
import '@babel/polyfill';
import login from './login';
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
  // MAPBOX
  if (document.getElementById('map')) {
    const locations = JSON.parse(
      document.getElementById('map').dataset.locations
    );
    mapBoxInit(locations);
  }
});
