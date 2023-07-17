import { Router } from 'express';

import * as authController from '../controllers/auth.js';
import * as homeController from '../controllers/home.js';
import * as authValidator from '../validators/auth.js';

const router = Router();

router.get('/', homeController.index);
router.get('/register', homeController.register);
router.post('/register', authValidator.register, authController.register);
router.get('/login', homeController.login);
router.post('/login', authValidator.login, authController.login);
router.get('/logout', authController.logout);

export default router;
