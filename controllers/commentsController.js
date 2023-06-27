const allComments_get = (req, res) => {
    res.send("All comments")
};

const comment_get = (req, res) => {
    res.send("Single Comment")
}

const comment_post = (req, res) => {
    res.send("Post comment")
};

const comment_update = (req, res) => {
    res.send("Update the comment")
};

const comment_delete = (req, res) => {
    res.send("Delete the comment")
};


export default {
    allComments_get,
    comment_get,
    comment_post,
    comment_update,
    comment_delete
};
