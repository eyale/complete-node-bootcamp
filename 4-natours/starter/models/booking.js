/**
 * Booking MODEL
 */

const mongoose = require('mongoose');
// 1 - create Schema
const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking should belong to a Tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking should belong to a User']
  },
  price: {
    type: Number,
    required: [true, 'Booking should have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
});

// 1.1 - populate Schema
bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({ name: 'tour', select: 'name' });
});
// 2 - create Model
const Booking = mongoose.model('Booking', bookingSchema);

// 3 - export Model
module.exports = Booking;
