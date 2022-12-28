const express = require('express');

const controller = require(`${__dirname}/../controllers/users.js`);

const router = express.Router();

router.route('/').get(controller.onGetAll).post(controller.onAddNew);

router
  .route('/:id')
  .get(controller.onGet)
  .patch(controller.onEdit)
  .delete(controller.onDelete);

module.exports = router;
