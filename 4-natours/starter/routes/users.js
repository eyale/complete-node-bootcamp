const express = require('express');
const H = require(`${__dirname}/../misc/helpers.js`);

const controller = require(`${__dirname}/../controllers/users.js`);

const router = express.Router();
router.use('id', H.checkId);

router
  .route('/')
  .get(controller.onGetAll)
  .post(H.checkBody, controller.onAddNew);

router
  .route('/:id')
  .get(controller.onGet)
  .patch(controller.onEdit)
  .delete(controller.onDelete);

module.exports = router;
