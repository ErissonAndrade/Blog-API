import express from 'express';
import postsController from '../controllers/postsController.js';

const router = express.Router();

router.get('/', postsController.allPosts_get);

router.post('/', postsController.post_post);

router.get('/:postId', postsController.post_get)

router.put('/:postId', postsController.post_update);

router.delete('/:postId', postsController.post_delete);

export default router;