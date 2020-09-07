const { Router } = require('express');

const router = Router();

const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');
const authValidator = require('../validators/auth');

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
  authValidator.delete,
  userController.delete
);

module.exports = router;
