const { Router } = require('express');
const validator = require('../middlewares/validation');
const userController = require('../controllers/user');

const router = new Router();

router.get('/me', userController.getCurrentUserInfo);
router.patch('/me', validator.updateProfileValidation, userController.updateProfile);

module.exports = router;
