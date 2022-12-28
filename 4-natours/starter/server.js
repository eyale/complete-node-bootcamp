const app = require(`${__dirname}/app.js`);
const K = require(`${__dirname}/misc/constants`);
const helpers = require(`${__dirname}/misc/helpers`);

app.listen(K.PORT, helpers.onAppStart);
