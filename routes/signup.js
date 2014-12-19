'use strict';
var express = require('express');
var router = express.Router();
var db = require('../libs/db');
var crypto = require('crypto');

router.post('/', function(req, res) {
  var id = req.body.id;
  var password = req.body.password;
  if (!id || !password) {
    res.status(400).end("Empty id or password");
  } else if (!(/^[0-9\(\)\/\+\ \-]*$/.test(id) || /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(id))) {
    res.status(400).end("Wrong id format");
  } else {
    var type = /^[0-9\(\)\/\+\ \-]*$/.test(id) ? "phone" : "email";
    var user = db.UserModel({id: id, password: password, type: type});
    user.save(function(err,user){
      if (err) console.log(err);
      var code = crypto.randomBytes(32).toString('base64');
      var token = db.AccessTokenModel({userId: id, token: code});
      token.save(function(err,token){
        if (err) { return res.status.end(err); }
          res.end('{"token_type":"bearer","access_token":"' + code + '"}' + '\n');
        });
    });
  }
});

module.exports = router;
