const { Router } = require('express');
const validator = require('../middlewares/validation');
const movieController = require('../controllers/movie');

const router = new Router();

router.get('/', movieController.getMovies);
router.post('/', validator.createMovieValidation, movieController.createMovie);
router.delete('/:movieId', validator.deleteMovieValidation, movieController.deleteMovie);

module.exports = router;
