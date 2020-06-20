const Review = require('../models/review');
const Post = require('../models/post');

module.exports = {
    // REVIEWS /create
    async reviewCreate(req, res, next) {
        let post = await Post.findById(req.params.id).populate('reviews').exec();
        let reviewed = post.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length;
        if(reviewed) {
            req.session.error = 'Only one review per post allowed';
            return res.redirect(`/posts/${post.id}`);
        }
        const { id, title} = post;

        req.body.review.author = req.user._id;
        req.body.review.location = id;
        req.body.review.postTitle = title;
        let review = await Review.create(req.body.review);
        post.reviews.push(review);

        let user = await User.findById(req.user._id).populate('followers').exec();;

        let newNotification = {
            username: req.user.username,
            postId: id,
        }
            
        for(const follower of user.followers) {
            let notification = await Notification.create(newNotification);
            follower.notifications.push(notification);
            follower.save();
        }

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
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.review_id }
        });
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = 'Review deleted successfully!'
        res.redirect(`/posts/${req.params.id}`);
    }
}