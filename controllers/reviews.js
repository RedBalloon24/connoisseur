const Review = require('../models/review');
const Post = require('../models/post');


module.exports = {
    // REVIEWS /create
    async reviewCreate(req, res, next) {
        let post = await Post.findById(req.params.id);
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        post.reviews.push(review);
        post.save();
        req.session.success = 'Review created successfully!';
        res.redirect(`/posts/${post.id}`);
    },
    // REVIEWS /update
    async reviewUpdate(req, res, next) {
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'Review updated successfully!'
        res.redirect(`/posts/${req.params.id}`);
    },
    // REVIEWS /delete
    async reviewDestroy(req, res, next) {
        
    }
}