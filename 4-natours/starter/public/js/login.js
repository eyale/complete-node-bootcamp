/* eslint-disable no-undef */

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: { email, password }
    });
    console.log('🪬', res);
  } catch (error) {
    console.log('❗️  error', error.response.data);
  }
};

window.addEventListener('load', () => {
  document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
});
