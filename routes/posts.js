import express from 'express';
import postsController from '../controllers/postsController.js';
import { requireAuth } from '../authMiddleware.js';

const router = express.Router();

router.get('/', postsController.allPosts_get);

router.post('/', requireAuth, postsController.post_post);

router.get('/:postId', postsController.post_get)

router.put('/:postId', requireAuth, postsController.post_update);

router.delete('/:postId', requireAuth, postsController.post_delete);

export default router;