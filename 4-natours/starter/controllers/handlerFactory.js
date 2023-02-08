/**
 *
 * FACTORY
 */

const K = require(`${__dirname}/../misc/constants`);
// const Tour = require(`${__dirname}/../models/tour`);
// const APIFeatures = require(`${__dirname}/../misc/apiFeatures`);
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

exports.updateOne = Model =>
  H.catchAsync(async (req, res, next) => {
    const {
      params: { id },
      body: withContent
    } = req;

    const options = { new: true, runValidators: true };
    const document = await Model.findByIdAndUpdate(id, withContent, options);

    if (!document) {
      return next(new AppError(`Document not found by id: ${id}`, 404));
    }

    res.status(200).json({
      status: K.STATUS.success,
      data: {
        document
      }
    });
  });

exports.createOne = Model =>
  H.catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: K.STATUS.success,
      data: {
        document
      }
    });
  });
