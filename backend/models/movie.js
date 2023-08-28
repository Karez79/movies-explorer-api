const { Schema, model } = require('mongoose');
const validator = require('validator');

const movieSchema = new Schema(
  {
    country: {
      required: true,
      type: String,
    },
    director: {
      required: true,
      type: String,
    },
    duration: {
      required: true,
      type: Number,
    },
    year: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
      validate: {
        validator: (image) => validator.isURL(image),
      },
    },
    trailerLink: {
      required: true,
      type: String,
      validate: {
        validator: (trailerLink) => validator.isURL(trailerLink),
      },
    },
    thumbnail: {
      required: true,
      type: String,
      validate: {
        validator: (thumbnail) => validator.isURL(thumbnail),
      },
    },
    owner: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    movieId: {
      required: true,
      type: Number,
    },
    nameRU: {
      required: true,
      type: String,
    },
    nameEN: {
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = model('movie', movieSchema);
