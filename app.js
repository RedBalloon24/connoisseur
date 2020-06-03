require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const seedPosts = require('./seeds');
// seedPosts();

//require routes
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');
// const usersRouter = require('./routes/users');

const app = express();

// connect to the database
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the database: ${MONGODB_URI}`);
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public assests directory
app.use(express.static('public'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// add moment to every view
app.locals.moment = require('moment');

// configure passport and sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'Super duper secret (change it)',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use(function(req, res, next) {
  // req.user = {
  //   // '_id' : '5ecc09dde4cede254bdad645',
  //   // 'username' : 'bob3'
  //   // '_id' : '5ec91a422d8cce168c08f5a4',
  //   // 'username' : 'bob2'
  //   '_id' : '5ec68e95557e951b2e6e7ff6',
  //   'username' : 'bob'
  // }
  res.locals.currentUser = req.user;
  // set default page title
  res.locals.title = 'Connoisseur';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue to next function in middleware chain
  next();
})

// mount routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back')
});

module.exports = app;
