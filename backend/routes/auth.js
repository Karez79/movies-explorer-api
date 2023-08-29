const { Router } = require('express');
const validator = require('../middlewares/validation');
const userController = require('../controllers/user');

const router = new Router();

router.post('/signin', validator.signInValidation, userController.login);
router.post('/signup', validator.signUpValidation, userController.createUser);

module.exports = router;
