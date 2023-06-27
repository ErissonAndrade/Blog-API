import express from 'express';
import commentsController from '../controllers/commentsController.js';

const router = express.Router();

router.get('/', commentsController.allComments_get);

router.post('/', commentsController.comment_post);

router.get('/:commentId', commentsController.comment_get)

router.put('/:commentId', commentsController.comment_update);

router.delete('/:commentId', commentsController.comment_delete);

export default router;