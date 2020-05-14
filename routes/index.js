const express = require('express');
const router = express.Router();
const passport = require('passport');
const { postRegister } = require('../controllers/index');
const { errorHandler } = require('../middleware/index');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop - Home' });
});

/* GET /register */
router.get('/register', (req, res, next) => {
  res.send('GET /register')
});

/* POST /register */
router.post('/register', errorHandler(postRegister));

/* GET login /login */
router.get('/login', (req, res, next) => {
  res.send('GET /login')
});

/* POST login /login */
router.post('/login', passport.authenticate("local", {
  successRedirect: "/", 
  failureRedirect: "/login" 
}));

/* GET logout /logout */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

/* GET profile /profile */
router.get('/profile', (req, res, next) => {
  res.send('GET /profile')
});

/* PUT profile /profile/:user_id */
router.get('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile/:user_id')
});

/* GET forgot password /forgot */
router.get('/forgot', (req, res, next) => {
  res.send('GET /forgot')
});

/* PUT forgot password /forgot */
router.put('/forgot', (req, res, next) => {
  res.send('PUT /forgot')
});

/* GET reset password /reset/:token */
router.get('/reset/:token', (req, res, next) => {
  res.send('GET /reset/:token')
});

/* PUT reset password /reset/:token */
router.put('/reset/:token', (req, res, next) => {
  res.send('PUT /reset/:token')
});

module.exports = router;
