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
    checKIfUserExists: async (req, res, next) => {
        let userExists =  await User.findOne({'email': req.body.email});
        if(userExists) {
            req.session.error = 'That email has already been registered';
            return res.redirect('back');
        }
        next();
    }
}