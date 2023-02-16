const express = require('express');

const viewC = require(`${__dirname}/../controllers/views`);
const authC = require(`${__dirname}/../controllers/auth`);

const router = express.Router();

router.get('/', authC.handleLoggedUser, viewC.getOverview);
router.get('/tour/:slug', authC.handleLoggedUser, viewC.getTour);
router.get('/login', authC.handleLoggedUser, viewC.login);
router.get('/me', authC.protect, viewC.me);

module.exports = router;
