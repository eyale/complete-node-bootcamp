/**
 * Tour MODEL
 */

const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// const User = require('./user');

const nameMaxLength = 40;
const nameMinLength = 10;
const difficultyEnum = ['easy', 'medium', 'difficult'];
const startLocationEnum = ['Point'];

const startLocationSchema = new mongoose.Schema({
  // GeoJSON
  type: {
    type: String,
    default: 'Point',
    enum: startLocationEnum
  },
  coordinates: [Number],
  address: String,
  description: String
});

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [nameMaxLength, `Name is too long. ${nameMaxLength} is a max`],
      minlength: [
        nameMinLength,
        `Name is too short. ${nameMinLength} is a min`
      ],
      validate: {
        validator: function(val) {
          const value = val.split(' ').join('');
          return validator.isAlpha(value);
        },
        message: 'Name should contain letters only'
      }
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: difficultyEnum,
        message: `Allowed values for difficulty: ${difficultyEnum}`
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating should be more than 1'],
      max: [5, 'Rating should be less than 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // works only on NEW item
          return val < this.price;
        },
        message: 'Discount value ({VALUE}) should be less than price'
      }
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: startLocationSchema,
    // startLocation: {
    //   // GeoJSON
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: startLocationEnum
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   description: String
    // },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: startLocationEnum
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE/HOOK - runs before .save/.crete
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('....saving document');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log('❗ >\n doc', doc);
//   next();
// });

// QUERY MIDDLEWARE/HOOK - processing query NOT the document
tourSchema.pre(/^find/, function(next) {
  // regex - all queries that starts with `find`
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  const populateOptions = {
    path: 'guides', // what to include in response
    select: '-__v -passwordChangeAt' // eliminate from response
  };
  this.populate(populateOptions);
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query exec time: ${Date.now() - this.start}mls`);
  next();
});

// AGGREGATION MIDDLEWARE/HOOK
tourSchema.pre('aggregate', function(next) {
  const aggregationExcludeSecretTour = {
    $match: { secretTour: { $ne: true } }
  };
  this.pipeline().unshift(aggregationExcludeSecretTour);
  console.log('💰', this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
