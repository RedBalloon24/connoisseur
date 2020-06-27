const User = require('../models/user');
const Post = require('../models/post');
const Review = require('../models/review');
const Notification = require('../models/notification');
const Cart = require('../models/cart');
const passport = require('passport');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const util = require('util');
const { cloudinary } = ('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { lookupService } = require('dns');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {
    // GET /
    async landingPage(req, res, next) {
        const posts = await Post.find({}).sort('-_id').exec();
        const recentPosts = posts.slice(0, 3);
        res.render('index', { posts, mapBoxToken, recentPosts, title: 'Connoisseur' })
    },
    // GET /register
    getRegister(req, res, next) {
        res.render('register', { title: 'Register', username: '', email: '' });
    },
    // POST /register
    async postRegister(req, res, next) {
        try {
            if(req.file) {
                const { secure_url, public_id } = req.file;
                req.body.image = { secure_url, public_id }
            }
			const user = await User.register(new User(req.body), req.body.password);
			req.login(user, function(err) {
				if (err) return next(err);
				req.session.success = `Welcome to Connoisseur, ${user.username}!`;
				res.redirect('/');
			});
		} catch(err) {
            deleteProfileImage(req);
			const { username, email } = req.body;
            let error = err.message;
			if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
				error = 'A user with the given email is already registered';
            }
			res.render('register', { title: 'Register', username, email, error });
		}
    },
    // GET /login
    getLogin(req, res, next) {
        if(req.isAuthenticated()) return res.redirect('/');
        if(req.query.returnTo) req.session.redirectTo = req.headers.referer
        res.render('login', { title: 'Login' });
    },
    //POST /login
    async postLogin(req, res, next) {
        const { email, password} = req.body;
        const { user, error } = await User.authenticate()(email, password);
        if(!user && error) {
            console.log(error)
            return next(error)
        }
        req.login(user, function(err) {
            if(err) {
                console.log(err)
                return next(err);
            }
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
    },
    //GET /logout
    getLogout(req, res, next) {
        req.logout();
        req.session.destroy();  
        res.redirect('/');
    },
    //GET /profile
    async getProfile(req, res, next) {
        const user = await User.findById(req.params.id);
        const posts = await Post.find().where('author.id', user._id).sort({ _id: -1 }).exec();
        const reviews = await Review.find().where('author', user._id).sort({ _id: -1 }).exec();

        res.render('profile', { user, posts, reviews});

    },
    //PUT /profile
    async updateProfile(req, res, next) {
        const { username, email } = req.body;
        const { currentUser } = res.locals;
        if(username) currentUser.username = username;
        if(email) currentUser.email = email;

        if(req.file) {
            if (currentUser.image.public_id) await cloudinary.v2.uploader.destroy(currentUser.image.public_id);
            const { secure_url, public_id } = req.file;
            currentUser.image = { secure_url, public_id }
        }

        await currentUser.save();
        
        const login = util.promisify(req.login.bind(req));
        await login(currentUser);
        req.session.success = 'Profile successfully updated!';
        res.redirect(`/users/${currentUser._id}`);        
    },
    //POST /profile/follow
    async postFollow(req, res, next) {
        let user = await User.findById(req.params.id);
  
        userFollow = user.followers.some(follower => {
            return follower.equals(req.user)
        });

        if(userFollow) {
            user.followers.pull(req.user);
        } else {
            user.followers.push(req.user);
        }

        await user.save()
        res.redirect(`/users/${user._id}`, { user })
    },
    //GET /notifications
    async getNotifications(req, res, next) {
        let user = await User.findById(req.user._id).populate({
            path: 'notifications',
            options: { sort: { "_id": -1 } }
        }).exec();

        let allNotifications = user.notifications;
        res.render('notifications/index', { allNotifications });

    },
    //GET /notifications/:id
    async getHandleNotifications(req, res, next) {
        let notification = await Notification.findById(req.params.id);
        notification.isRead = true;

        notification.save();
        res.redirect(`/posts/${notification.postId}`);
    },
    //GET /shopping-cart
    async getShoppingCart(req, res, next) {
        if(!req.session.cart) {
            return res.render('shop/cart', { posts: null });
        }

        let cart = await new Cart(req.session.cart);
        return res.render('shop/cart', { posts: cart.generateArray(), totalPrice: cart.totalPrice });
    },
    //GET /reduce/:id"
    async reduceShoppingCartValue(req,res, next) {
        let postId = req.params.id;
        let cart = await new Cart(req.session.cart ? req.session.cart : {});

    
        cart.reduceByOne(postId);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    },
    //GET /increase/:id"
    async increaseShoppingCartValue(req,res, next) {
        let postId = req.params.id;
        let cart = await new Cart(req.session.cart ? req.session.cart : {});

        cart.increaseByOne(postId);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    },
    //GET /remove/:id"
    async removeShoppingCart(req,res, next) {
        let postId = req.params.id;
        let cart = await new Cart(req.session.cart ? req.session.cart : {});


        cart.removeItem(postId);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    },
    //GET /forgot-password
    getForgotPw(req, res, next) {
        res.render('users/forgot')
    },
    //PUT /forgot-password
    async putForgotPw(req, res, next) {
        const token = await crypto.randomBytes(20).toString('hex');
        const user = await User.findOne({ email: req.body.email });
        if(!user) {
            req.session.error = 'No account with that email address exists.'
            return res.redirect('/forgot-password');
        }
        user.resetPasswordToken = token;
        //expires in one hour
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        const message = {
            to: user.email,
            from: 'RedBalloon_Designs@outlook.com',
            subject: 'Connoisseur - Forgot Password  Reset',
            text: `You are receiving this because you (or someone else) 
            have requested the reset of the password for your account.
            Please click on the following link, or copy and paste it 
            into your browser to complete the process: 
            http://${req.headers.host}/reset/${token} 
            If you did not request this, please ignore this email and 
            your password will remain unchanged.`.replace(/            /g, ''),
            //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        await sgMail.send(message);
        
        req.session.success = `An email has been sent to ${user.email} with further instructions.`
        res.redirect('/forgot-password')
    },
    //GET /reset/:token 
    async getReset(req, res, next) {
        const { token } = req.params;
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
         });
        
        if(!user) {
            req.session.error = 'Password reset token is invalid or expired!';
            return res.redirect('/forgot-password');
        }

        res.render('users/reset', { token });
    },
    //PUT /reset/:token 
    async putReset(req, res, next) {
        const { token } = req.params;
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
         });
        
        if(!user) {
            req.session.error = 'Password reset token is invalid or expired!';
            return res.redirect('/forgot-password');
        }

        if(req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.session.error = 'Passwords do not match.';
            return res.redirect(`/reset/${ token }`);
        }

        const message = {
            to: user.email,
            from: 'RedBalloon_Designs@outlook.com',
            subject: 'Connoisseur - Password Changed',
            text: `Hello,
            This email is to confirm that the password for your account has just been changed.
            
            If you did not make this change, please hit reply and notify us at once.`.replace(/            /g, '')
          };
          
          await sgMail.send(message);
        
          req.session.success = 'Password successfully updated!';
          res.redirect('/');
    }
}