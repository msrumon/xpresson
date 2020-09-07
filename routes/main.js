const { Router } = require('express');

const router = Router();

const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');

router.get('/', homeController.index);
router.get('/register', homeController.register);
router.post('/register', authValidator.register, authController.register);
router.get('/login', homeController.login);
router.post('/login', authValidator.login, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
