/**
 * User MODEL
 */

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const K = require(`${__dirname}/../misc/constants.js`);

const nameMaxLength = 40;
const nameMinLength = 1;
const passwordMinLength = 8;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
    maxlength: [
      nameMaxLength,
      `Name is too long. Maximum is: ${nameMaxLength}`
    ],
    minlength: [
      nameMinLength,
      `Name is too short. Minimum is: ${nameMinLength}`
    ],
    validate: {
      validator: function(val) {
        const value = val.split(' ').join('');
        return validator.isAlpha(value);
      },
      message: 'Name should contain only letters.'
    }
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User must have email'],
    trim: true,
    validate: [validator.isEmail, 'Email is not correct']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: Object.keys(K.ROLES).map(role => K.ROLES[role]),
    default: K.ROLES.user
  },
  password: {
    type: String,
    require: [true, 'Password is empty'],
    minlength: passwordMinLength,
    select: false
  },
  confirmPassword: {
    type: String,
    require: [true, 'Password is empty'],
    // Validation will work only on CREATE and SAVE in Mongo
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangeAt: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 13);
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.checkIsPasswordMatched = async function(
  passwordToCheck,
  hashedPassword
) {
  return await bcrypt.compare(passwordToCheck, hashedPassword);
};

userSchema.methods.checkIsPassChangedAfterTokenReceived = function(
  tokenTimestamp
) {
  if (this.passwordChangeAt) {
    const changeAtTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return changeAtTimeStamp > tokenTimestamp;
  }

  // not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
