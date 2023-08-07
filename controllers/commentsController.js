const Comment = require('../models/comments.js');
const Post = require('../models/posts.js');
const { body, validationResult } = require('express-validator');

const commentsValidators = () => [
    body('user')
        .isLength({ min: 1 })
        .withMessage('User must not be empty')
        .isLength({ max: 10 })
        .withMessage('Your user must not exceed 15 characters')
        .trim()
        .escape(),
    body('message')
        .isLength({ min: 1 })
        .withMessage('Message must not be empty')
        .isLength({ max: 100 })
        .withMessage('Your message must not exceed 100 characters')
        .trim()
        .escape()
];

const allComments_get = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId).populate("comments");
        const comments = post.comments
        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const comment_get = async (req, res, next) => {
    try {
        const comments = await Comment.findById(req.params.commentId);
        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
};

const comment_post = [
    commentsValidators(),

    async (req, res, next) => {
        try {
            const { user, message } = req.body

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({ error: errors.array() })
            };

            const newComment = new Comment({
                user: user,
                date: new Date(),
                message: message
            });
            await newComment.save();
            await Post.findByIdAndUpdate(req.params.postId, {
                $push: { comments: newComment }
            });
            
            return res.status(200).json({ message: 'Comment created successfully!' });
        } catch (error) {
            console.error(error);
            next(error);
            return res.status(500).json({ error: 'An error occurred' })
        }
    }
];

const comment_update = [
    commentsValidators(),

    async (req, res, next) => {
        try {
            const { user, message } = req.body

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({ error: errors.array() })
            };
            await Comment.findByIdAndUpdate(req.params.commentId, {
                user: user,
                message: message,
                lastUpdate: new Date()
            });
            return res.status(200).json({ message: 'Post updated successfully' });
        } catch (error) {
            console.error(error);
            next(error);
            return res.status(500).json({ error: 'An error occurred' })
        }
    }
];

const comment_delete = async (req, res, next) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
};

module.exports = {
    allComments_get,
    comment_get,
    comment_post,
    comment_update,
    comment_delete
};
