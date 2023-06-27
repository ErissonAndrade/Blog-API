const allPosts_get = (req, res) => {
    res.send("All posts")
};

const post_get = (req, res) => {
    res.send("Single Post")
}

const post_post = (req, res) => {
    res.send("Post the post")
};

const post_update = (req, res) => {
    res.send("Update the post")
};

const post_delete = (req, res) => {
    res.send("Delete the post")
};


export default {
    allPosts_get,
    post_get,
    post_post,
    post_update,
    post_delete
};

