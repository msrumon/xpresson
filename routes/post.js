import { Router } from 'express';

import * as postController from '../controllers/post.js';
import authMiddleware from '../middlewares/auth.js';
import * as postValidator from '../validators/post.js';

const router = Router();

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
  postController.remove
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

export default router;
