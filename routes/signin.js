'use strict';
var express = require('express');
var router = express.Router();
var db = require('../libs/db');
var crypto = require('crypto');

router.post('/', function(req,res) {
  var id = req.body.id;
  var password = req.body.password;
  if (!id || !password) {
    return res.status(400).end("Empty id or password");
  }
  var user = db.UserModel.findOne({ id: id }, function(err, user) {
    if (err) { return res.status.end(err); }
    if (!user) { return res.status.end('Wrong id'); }

    if (user.check(password)) {
      var code = crypto.randomBytes(32).toString('base64');
      var token = db.AccessTokenModel({userId: id, token: code});
      token.save(function(err,token){
        if (err) { return res.status.end(err); }
        res.end('{"token_type":"bearer","access_token":"' + code + '"}' + '\n');
      });
    } else {
      return res.status.end('Wrong password');
    }
  });
});

module.exports = router;
