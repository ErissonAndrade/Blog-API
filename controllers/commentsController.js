import Comment from '../models/comments.js'
import Post from '../models/posts.js'

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
}

const comment_post = async (req, res, next) => {
    try {
        const { user, message } = req.body
        const newComment = new Comment({
            user: user,
            date: new Date(),
            message: message
        });
        await newComment.save();
        await Post.findByIdAndUpdate(req.params.postId, {
            $push: { comments: newComment }
        })
        return res.status(200).json({ message: 'Post created successfully' });
    } catch(error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
};

const comment_update = async (req, res, next) => {
    const { user, message } = req.body
    try {
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
};

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

export default {
    allComments_get,
    comment_get,
    comment_post,
    comment_update,
    comment_delete
};
