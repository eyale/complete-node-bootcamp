const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require(`${__dirname}/app.js`);
const helpers = require(`${__dirname}/misc/helpers`);

app.listen(process.env.PORT || 8000, helpers.onAppStart);
