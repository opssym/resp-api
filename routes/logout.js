'use strict';
var express = require('express');
var router = express.Router();
var db = require('../libs/db');

router.get('/', function(req,res) {
  if (req.query.all === "true") {
    db.AccessTokenModel.remove({userId: req.user[0].id}, function(err) {
      if (err) { return res.status(400).end(err); }
      res.end('All token removed');
    });
  } else {
    db.AccessTokenModel.remove({token: req.headers['authorization'].split(' ')[1]}, function(err) {
      if (err) { return res.status(400).end(err); }
        res.end('Token removed');
    });
  }
});

module.exports = router;
