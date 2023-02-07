/**
 * Review MODEL
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Add review note']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review should belong to Tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review should belong to User']
    }
  },
  {
    // needed to populate make work
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.select('-__v');
  next();
});

reviewSchema.pre(/^find/, function(next) {
  const tourOptions = {
    path: 'tour',
    select: 'name'
  };
  const userOptions = {
    path: 'user',
    select: 'name photo'
  };
  // this.populate(tourOptions).populate(userOptions);
  this.populate(userOptions);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
