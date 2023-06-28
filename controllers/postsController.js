import Post from '../models/posts.js';

const allPosts_get = async (req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const post_get = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
}

const post_post = async (req, res) => {
    try {
        const { title, text } = req.body
        const post = new Post({
            title: title,
            date: new Date(),
            text: text
        });
        await post.save();
        return res.status(200);
    } catch(error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

const post_update = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.postId);
        return res.status(200);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).json({ error: 'An error occurred' })
    }
};

const post_delete = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.postId);
        return res.status(200);
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

