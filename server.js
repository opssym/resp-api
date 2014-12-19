'use strict';

var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', process.env.PORT || 3000);

var signin = require('./routes/signin');
var signup = require('./routes/signup');
var info = require('./routes/info');
var latency = require('./routes/latency');
var logout = require('./routes/logout');

app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

require('./libs/auth');

app.use('/signin', signin);
app.use('/signup', signup);
app.use('/info', passport.authenticate('bearer', { session: false }), info);
app.use('/latency', passport.authenticate('bearer', { session: false }), latency);
app.use('/logout', passport.authenticate('bearer', { session: false }), logout);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err.message);
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
