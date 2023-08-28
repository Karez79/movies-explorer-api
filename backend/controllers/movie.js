const Movie = require('../models/movie');
const ApiError = require('../exceptions/api-error');

const getMovies = (req, res, next) => {
  Movie.find()
    .orFail(() => {
      next(ApiError.NotFound('Карточки не были найдены'));
    })
    .then((cards) => {
      res.send(cards);
    })
    .catch((e) => {
      next(e);
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((e) => {
      if (e.errors) {
        next(ApiError.BadRequest(Object.values(e.errors)[0].message));
        return;
      }
      next(e);
    });
};

const deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params.movieId)
    .orFail(() => {
      next(ApiError.NotFound('Фильм с данным id не найден'));
    })
    .then((card) => {
      if (req.user._id !== `${card.owner}`) {
        next(ApiError.Forbidden('Id владельца фильма отлично от данного пользователя'));
        return;
      }

      Movie.deleteOne(card)
        .then((removedCard) => {
          res.send(removedCard);
        });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(ApiError.BadRequest('Некорректный id фильма'));
        return;
      }
      next(e);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
