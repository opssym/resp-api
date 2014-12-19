'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
  res.json({ id: req.user[0].id, type: req.user[0].type });
});

module.exports = router;
