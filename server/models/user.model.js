'use strict';

Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
    unique: "Phone ({VALUE}) is already registered with another user.",
    sparse: true,
    // required:[true,'Phone is required']
    validate: {
      validator: function (v) {
        var flag;
        if (v == null || v == "") { return true; }
        else {
          return /^(\+91-|\+91|0)?\d{10}$/.test(v);
        }
      },
      message: '{VALUE} is not a valid Phone. for ex- 9852110871(10 Digit)'
    }
  },
  email: {
    type: String,
    unique: "Email ({VALUE}) is already registered with another user.",
    required: true,
    sparse: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        var flag;
        if (v == null || v == "") { return true; }
        else {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(v);
        }
      },
      message: '{VALUE} is not a valid Email. for ex- someone@domain.com'
    }
  },
  password: {
    type: String,
    select: false
  },
  gender: {
    type: String,
    lowercase: true,
    required: false,
    default: null
  },
  forgot_password_otp: {
    otp: {
      type: String
    },
    created: {
      type: Date
    }
  },
  is_verified: {
    type: Boolean
  },
  profilePicture: {
    type: String
  },
  google_access_token: {
    type: String
  },
  google_refresh_token: {
    type: String
  },
  google_id_token: {
    type: String
  },
  profiles: {
    type:{
      facebook: String,
      google: String
    },
    default:{}
  },
  random_key: {
    // Actually
    type: String,
    default: null,
    select: false
  }
}, { timestamps: true });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
// export default UserSchema;
module.exports = { UserSchema };
