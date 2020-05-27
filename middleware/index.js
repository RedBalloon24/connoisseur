const Review = require('../models/review')
const User = require('../models/user')

module.exports = {
    asyncErrorHandler: (fn) => 
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        },
    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        if(review.author.equals(req.user._id)) {
            return next();
        }
        req.session.error = 'Permission denied';
        return res.redirect('/');
    },
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.session.error = 'Login required!';
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    }
}