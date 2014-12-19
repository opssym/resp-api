var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var db = require('./db');
var config = require('config');

passport.use(new BearerStrategy( function(accessToken, done) {
  db.AccessTokenModel.findOne({ token: accessToken }, function(err, token) {
    if (err) { return done(err); }
    if (!token) { return done(null, false); }

    if( Math.round((Date.now()-token.created)/1000) > config.get('lifeTime') ) {
      db.AccessTokenModel.remove({ token: accessToken }, function (err) {
        if (err) return done(err);
      });
      return done(null, false, { message: 'Token expired' });
    }

    token.created = Date.now();
    token.save(function(err){
      if (err) { return done(err); }
      db.UserModel.find({id: token.userId}, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user' }); }

        done(null, user);
      });
    });
  });
}));
