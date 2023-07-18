import Post from '../models/posts.js';
import Images from '../models/images.js';
import { body, validationResult } from 'express-validator';

const postsValidators = () => [
    body('title')
        .isLength({ min: 1 })
        .withMessage('Title must not be empty')
        .trim()
        .escape(),
    body('text')
        .isLength({ min: 1 })
        .withMessage('Text must not be empty')
        .trim()
        .escape()
];

const allPosts_get = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('images');
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const post_get = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId).populate('comments').populate('images');
        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
}

const post_post = [
    postsValidators(),

    async (req, res, next) => {
        try {
            const { title, text } = req.body

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({ error: errors.array() })
            };

            const post = new Post({
                title: title,
                date: new Date(),
                text: text
            });
            await post.save();
            return res.status(200).json({ message: 'Post created successfully' });
        } catch (error) {
            console.error(error);
            next(error);
            return res.status(500).json({ error: 'An error occurred' })
        }
    }
];

const post_update = [
    postsValidators(),

    async (req, res, next) => {
        const { title, text } = req.body

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ error: errors.array() })
        };

        try {
            await Post.findByIdAndUpdate(req.params.postId, {
                title: title,
                text: text,
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

const post_delete = async (req, res, next) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
};

export default {
    allPosts_get,
    post_get,
    post_post,
    post_update,
    post_delete
};

