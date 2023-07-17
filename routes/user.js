import { Router } from 'express';

import * as userController from '../controllers/user.js';
import authMiddleware from '../middlewares/auth.js';
import * as authValidator from '../validators/auth.js';

const router = Router();

router.get('/', authMiddleware, userController.index);
router.get('/update', authMiddleware, userController.edit);
router.post(
  '/update',
  authMiddleware,
  authValidator.update,
  userController.update
);
router.get('/delete', authMiddleware, userController.erase);
router.post(
  '/delete',
  authMiddleware,
  authValidator.remove,
  userController.remove
);

export default router;
