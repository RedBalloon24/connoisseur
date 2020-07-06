const Post = require('../models/post');
const User = require('../models/user');
const Notification = require('../models/notification');
const Cart = require('../models/cart');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary')

module.exports = {
    // POSTS /index
    async postIndex(req, res, next) {
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery;
        let posts = await Post.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 12,
            sort: '-_id'
        });
        posts.page = Number(posts.page);
        if(!posts.docs.length && res.locals.query) {
            res.locals.error = 'No results found';
        }
        res.render('posts/index', { posts, mapBoxToken, title: 'Posts Index' });
    },
    // POSTS /new
    postNew(req, res, next) {
        res.render('posts/new');
    },
    // POSTS /create
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for(const file of req.files){
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        req.body.post.geometry = response.body.features[0].geometry;
        req.body.post.author = { id: req.user._id, username: req.user.username };
        
        let post = new Post(req.body.post);
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;

        let user = await User.findById(req.user._id);

        let newNotification = {
            username: req.user.username,
            postId: post.id
        }

        for(const follower of user.followers) {
            let notification = await Notification.create(newNotification);
            let followerUser = await User.findById(follower._id);
            followerUser.notifications.push(notification);
            followerUser.save();
        }

        await post.save();          
        req.session.success = "Post created successfully!";
        res.redirect(`/posts/${post.id}`);
    },
    // POSTS /show
    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id).populate({
            path: 'reviews',
            options: { sort: { '_id': -1 } },
            populate: {
                path: 'author',
                model: 'User'
            }
        });


        const floorRating = post.calculateAvgRating();
        // const floorRating = post.avgRating;
        res.render('posts/show', { post, mapBoxToken, floorRating, title: 'Posts Show' });
    },
    // POSTS /edit
    postEdit(req, res, next) {
        res.render('posts/edit');
    },
    // POSTS /update
    async postUpdate(req, res, next) {
        // destructure post from res.locals
        const { post } = res.locals;
        // check if there are any images for deletion
        if(req.body.deleteImages && req.body.deleteImages.length) {
            let deleteImages = req.body.deleteImages;
            for(const public_id of deleteImages) {
                await cloudinary.v2.uploader.destroy(public_id);
                for(const image of post.images) {
                    if(image.public_id === public_id) {
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1);
                    }
                }
            }
        }
        // check if there are any new images for upload
        if(req.files) {
            for(const file of req.files){
                post.images.push({
                    url: file.secure_url,
                    public_id: file.public_id
                });
            }
        }
        // check if location was updated
        if(req.body.post.location !== post.location){
            let response = await geocodingClient
                .forwardGeocode({
                    query: req.body.post.location,
                    limit: 1
                })
                .send();
            post.geometry = response.body.features[0].geometry;
            post.location = req.body.post.location;

        }
        // update post with new properties
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        post.type = req.body.post.type;
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        await post.save();

        res.redirect(`/posts/${post.id}`);
    },
    // POSTS /delete
    async postDestroy(req, res, next) {
        const { post } = res.locals;        
        for(const image of post.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted successfully!';
        res.redirect('/posts');
    },
    //GET /add-to-cart/:id
    async getAddToCart(req,res, next) {
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        let post = await Post.findById(req.params.id);
       

        cart.add(post, post.id);

        req.session.cart = cart;
        console.log(req.session.cart);

        res.redirect(`/posts/${post.id}`);
    }
}