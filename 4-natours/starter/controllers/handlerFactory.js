/**
 *
 * FACTORY
 */

const K = require(`${__dirname}/../misc/constants`);
const Tour = require(`${__dirname}/../models/tour`);
const APIFeatures = require(`${__dirname}/../misc/apiFeatures`);
const H = require(`${__dirname}/../misc/helpers`);
const AppError = require(`${__dirname}/../misc/appError`);

exports.deleteOne = Model =>
  H.catchAsync(async (req, res, next) => {
    const {
      params: { id }
    } = req;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError(`Document  by id: ${id} not found`, 404));
    }

    res.status(204).json({
      status: K.STATUS.success,
      data: null
    });
  });
