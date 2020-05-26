const express = require('express');
const router = express.Router();
const { landingPage, postRegister, postLogin, getLogout } = require('../controllers/index');
const { asyncErrorHandler } = require('../middleware/index');


/* GET home/landing page */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', (req, res, next) => {
  res.send('GET /register')
});

/* POST /register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET login /login */
router.get('/login', (req, res, next) => {
  res.send('GET /login')
});

/* POST login /login */
router.post('/login', postLogin);

/* GET logout /logout */
router.get('/logout', getLogout)

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
