const express = require('express');
const commentsController = require('../controllers/commentsController.js');
const { requireAuth } = require( '../middlewares/authMiddleware.js');

const router = express.Router({ mergeParams: true });

router.get('/', commentsController.allComments_get);

router.post('/', commentsController.comment_post);

router.get('/:commentId', commentsController.comment_get)

router.put('/:commentId', requireAuth, commentsController.comment_update);

router.delete('/:commentId', requireAuth, commentsController.comment_delete);

module.exports = router;