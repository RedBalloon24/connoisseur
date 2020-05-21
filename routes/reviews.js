const express = require('express');
const router = express.Router({ mergeParams: true});
const { asyncErrorHandler } = require('../middleware');
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy
} = require('../controllers/reviews');

/* POST reviews create /posts/:id/reviews */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT reviews update /posts/:id/reviews/:review_id */
router.put('/:review_id', asyncErrorHandler(reviewUpdate));

/* DELETE reviews destroy /posts/:id/reviews/:review_id */
router.delete('/:id', (req, res, next) => {
    res.send('/posts/:id/reviews/:review_id')
});


module.exports = router;
