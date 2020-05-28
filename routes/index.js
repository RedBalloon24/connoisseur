const express = require('express');
const router = express.Router();
const { asyncErrorHandler, isLoggedIn } = require('../middleware/index');
const { 
  landingPage,
  getRegister, 
  postRegister, 
  getLogin,
  postLogin, 
  getLogout,
  getProfile
} = require('../controllers/index');


/* GET home/landing page */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET login /login */
router.get('/login', getLogin);

/* POST login /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET logout /logout */
router.get('/logout', getLogout)

/* GET profile /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

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
