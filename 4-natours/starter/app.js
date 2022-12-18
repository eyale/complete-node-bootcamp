const express = require('express');
const app = express();

const K = {
  APP_NAME: 'Natours',
  PORT: 3000,
};

app.get('/', (req, res) => {
  res.status(200).json({ app: K.APP_NAME, message: 'HELLO from 🔙 🔚' });
});

app.post('/', (req, res) => {
  res
    .status(200)
    .json({ app: K.APP_NAME, message: 'POST method is also works properly' });
});

app.listen(K.PORT, () => {
  console.log(`App running at ${K.PORT}...`);
});
