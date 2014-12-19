'use strict';
var mongoose = require('mongoose');
var crypto = require('crypto');
var debug = require('debug')('mongodb');
var config = require('config');
var crypto = require('crypto');

mongoose.connect(config.get('mongodb.uri'));
var db = mongoose.connection;

var Schema = mongoose.Schema;

db.on('error', function (err) {
  debug('connection error: ', err.message);
});

db.once('open', function () {
  debug("Connected to mongolab");
});

var User = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  type : {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

User.methods.encrypt = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.virtual('password').set(function(password) {
  this.salt = crypto.randomBytes(16).toString('base64');
  this.encryptedPassword = this.encrypt(password);
});

User.methods.check = function(password) {
  return this.encrypt(password) === this.encryptedPassword;
};

var UserModel = mongoose.model('User', User);

var AccessToken = new Schema({
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var AccessTokenModel = mongoose.model('AccessToken', AccessToken);

module.exports.UserModel = UserModel;
module.exports.AccessTokenModel = AccessTokenModel;
