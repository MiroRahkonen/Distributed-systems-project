var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.set('strictQuery', true);

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var userRouter = require('./routes/user');
var upvoteRouter = require('./routes/upvote');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/post', postRouter);
app.use('/comment',commentRouter);
app.use('/user',userRouter);
app.use('/upvote',upvoteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Mongoose setup
const dbURL = 'mongodb://127.0.0.1:27017/testdb';
mongoose.connect(dbURL);
mongoose.Promise = Promise;
const mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'MongoDB connection failed'));
mongoose.set('strictQuery', true);

module.exports = app;