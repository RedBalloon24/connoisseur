const Post = require('../models/post');

module.exports = {
    // POSTS /index
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts });
    },
    // POSTS /new
    postNew(req, res, next) {
        res.render('posts/new');
    },
    // POSTS /create
    async postCreate(req, res, next) {
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`);
    },
    // POSTS /show
    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render('posts/show', { post });
    },
    // POSTS /edit
    async postEdit(req, res, next)     {
        let post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    },
     // POSTS /update
     async postUpdate(req, res, next)     {
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
        res.redirect(`/posts/${post.id}`);
    },
     // POSTS /delete
     async postDestroy(req, res, next)     {
        let post = await Post.findByIdAndRemove(req.params.id);
        res.redirect('/posts');
    }
}