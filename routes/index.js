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
  putReset,
  postFollow,
  getNotifications,
  getHandleNotifications,
  getShoppingCart,
  reduceShoppingCartValue,
  increaseShoppingCartValue,
  removeShoppingCart,
  getCheckout,
  postCheckout
} = require('../controllers/index');


/* GET home /landing page */
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
router.get('/users/:id', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT profile /profile */
router.put('/users/:id', 
  isLoggedIn, 
  upload.single('image'), 
  asyncErrorHandler(isValidPassword), 
  asyncErrorHandler(changePassword), 
  asyncErrorHandler(updateProfile)
);

// /* DELETE profile /profile */
// router.delete('/users/:id', isLoggedIn, asyncErrorHandler(deleteProfile));

/* POST follow /profile/follow */
router.post('/users/:id/follow', isLoggedIn, asyncErrorHandler(postFollow));

/* GET notifications /notifications */
router.get('/notifications', isLoggedIn, asyncErrorHandler(getNotifications));

/* GET handle notifications /notifications/:id */
router.get('/notifications/:id', isLoggedIn, asyncErrorHandler(getHandleNotifications));

/* GET cart /shopping-cart */
router.get('/shopping-cart', asyncErrorHandler(getShoppingCart));

/* GET cart /reduce/:id */
router.get('/reduce/:id', asyncErrorHandler(reduceShoppingCartValue));

/* GET cart /increase/:id */
router.get('/increase/:id', asyncErrorHandler(increaseShoppingCartValue));

/* GET checkout /checkout */
router.get('/remove/:id', asyncErrorHandler(removeShoppingCart));

/* GET cart /remove/:id */
router.get('/checkout', asyncErrorHandler(getCheckout));

/* POST checkout /checkout */
router.post('/checkout', asyncErrorHandler(postCheckout));

/* GET forgot password /forgot */
router.get('/forgot-password', getForgotPw);

/* PUT forgot password /forgot */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET reset password /reset/:token */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT reset password /reset/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));


module.exports = router;
