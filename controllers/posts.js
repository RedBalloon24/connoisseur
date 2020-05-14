const Post = require('../models/post');

module.exports = {
    // POSTS /index
    async getPosts(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },
    // POSTS /new
    newPost(req, res, next) {
        res.render('posts/new');
    },
    // POSTS /create
    async createPost(req, res, next) {
        let post = await Post.create(req.body);
        res.redirect(`/posts/${post.id}`);
    },
    // POSTS /show
    async showPost(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    }


}