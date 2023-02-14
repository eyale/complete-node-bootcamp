const express = require('express');

const viewController = require(`${__dirname}/../controllers/views`);
const authController = require(`${__dirname}/../controllers/auth`);

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/tour/:slug', authController.protect, viewController.getTour);

router.get('/login', viewController.login);

module.exports = router;
