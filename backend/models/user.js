const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (email) => validator.isEmail(email),
      },
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = model('user', userSchema);
