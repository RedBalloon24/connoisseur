const Post = require('../models/post');

module.exports = {
    //POSTS /index
    async getPosts(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },
    //POSTS /new
    newPost(req, res, next) {
        res.render('posts/new');
    },

}