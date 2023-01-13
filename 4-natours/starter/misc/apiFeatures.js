class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryParams = { ...this.queryString };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];

    excludedFields.forEach(field => {
      delete queryParams[field];
    });

    let queryString = JSON.stringify(queryParams);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitProperties() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const skip = (page - 1) * limit; // 0 - value incase no page

    this.query = this.query.skip(skip).limit(limit);

    // const count = await Tour.countDocuments();
    // if (this.queryString.page) {
    //   if (skip >= count) throw new Error('Page not exists');
    // }

    return this;
  }
}

module.exports = APIFeatures;
