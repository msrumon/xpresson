const { Router } = require('express');

const router = Router();

const postController = require('../controllers/post');
const authMiddleware = require('../middlewares/auth');
const postValidator = require('../validators/post');

router.get('/', postValidator.page, postController.index);
router.get('/new', authMiddleware, postController.create);
router.post('/', authMiddleware, postValidator.post, postController.store);
router.get('/:id', postValidator.id, postValidator.page, postController.show);
router.get(
  '/:id/update',
  authMiddleware,
  postValidator.id,
  postController.edit
);
router.post(
  '/:id/update',
  authMiddleware,
  postValidator.id,
  postValidator.post,
  postController.update
);
router.get(
  '/:id/delete',
  authMiddleware,
  postValidator.id,
  postController.erase
);
router.post(
  '/:id/delete',
  authMiddleware,
  postValidator.id,
  postController.delete
);
router.post(
  '/:id/likes',
  authMiddleware,
  postValidator.id,
  postController.likes
);
router.post(
  '/:id/comments',
  authMiddleware,
  postValidator.id,
  postValidator.comment,
  postController.comments
);

module.exports = router;
