/**
 *
 * CONTROLLER Tours
 */

const K = require(`${__dirname}/../misc/constants.js`);
const Tour = require(`${__dirname}/../models/tour.js`);

const onGetAll = async (req, res) => {
  try {
    // 1 BUILD query
    const queryParams = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];

    excludedFields.forEach(field => {
      delete queryParams[field];
    });

    let queryString = JSON.stringify(queryParams);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryString));

    // 2 SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log('❗ >\n sortBy', sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3 Properties limit - respond with requested properties
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // 3 EXECUTE query
    const tours = await query;

    // 3 SEND response
    res.status(200).json({
      status: K.STATUS.success,
      requestedAt: req.requestedAt,
      count: tours.length,
      data: {
        tours: tours
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: 'Error'
    });
  }
};

const onGet = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: K.STATUS.success,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: 'Error'
    });
  }
};

const onAddNew = async (req, res) => {
  try {
    const newItem = await Tour.create(req.body);

    res.status(201).json({
      status: K.STATUS.success,
      data: {
        tour: newItem
      }
    });
  } catch (error) {
    res.status(400).json({
      status: K.STATUS.fail,
      message: error
    });
  }
};

const onEdit = async (req, res) => {
  try {
    const {
      params: { id },
      body: withContent
    } = req;

    const options = { new: true, runValidators: true };
    const tour = await Tour.findByIdAndUpdate(id, withContent, options);

    res.status(200).json({
      status: K.STATUS.success,
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.fail,
      message: `Invalid data send`
    });
  }
  // const tour = K.toursData.find(item => item.id === id);

  res.status(200).json({
    status: K.STATUS.success,
    tour: 'Update tour...'
  });
};

const onDelete = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;

    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: K.STATUS.success,
      data: null
    });
  } catch (error) {
    res.status(401).json({
      status: K.STATUS.error,
      message: 'Invalid data send'
    });
  }
};

module.exports = {
  onGetAll,
  onGet,
  onAddNew,
  onEdit,
  onDelete
};
