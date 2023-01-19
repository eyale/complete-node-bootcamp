const express = require('express');

const controller = require(`${__dirname}/../controllers/tours.js`);
// const H = require(`${__dirname}/../misc/helpers.js`);

const router = express.Router();
// router.param('id', H.checkId);

router.route('/top-5-cheap').get(controller.topFiveCheap, controller.onGetAll);

router.route('/tour-stats').get(controller.getTourStats);
router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

router
  .route('/')
  .get(controller.onGetAll)
  .post(controller.onAddNew);

router
  .route('/:id')
  .get(controller.onGet)
  .patch(controller.onEdit)
  .delete(controller.onDelete);

module.exports = router;
