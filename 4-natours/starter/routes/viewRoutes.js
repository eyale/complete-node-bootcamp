const express = require('express');

const viewController = require(`${__dirname}/../controllers/views`);
const authController = require(`${__dirname}/../controllers/auth`);

const router = express.Router();

router.use(authController.handleLoggedUser);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.login);

module.exports = router;
