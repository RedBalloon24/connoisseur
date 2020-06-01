const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { 
  asyncErrorHandler, 
  isLoggedIn, 
  isValidPassword, 
  changePassword 
} = require('../middleware/index');
const { 
  landingPage,
  getRegister, 
  postRegister, 
  getLogin,
  postLogin, 
  getLogout,
  getProfile,
  updateProfile,
  getForgotPw,
  putForgotPw,
  getReset,
  putReset
} = require('../controllers/index');


/* GET home/landing page */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

/* GET login /login */
router.get('/login', getLogin);

/* POST login /login */
router.post('/login', asyncErrorHandler(postLogin));

/* GET logout /logout */
router.get('/logout', getLogout)

/* GET profile /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT profile /profile */
router.put('/profile', 
  isLoggedIn, 
  upload.single('image'), 
  asyncErrorHandler(isValidPassword), 
  asyncErrorHandler(changePassword), 
  asyncErrorHandler(updateProfile)
);

/* GET forgot password /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT forgot password /forgot */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET reset password /reset/:token */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT reset password /reset/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
