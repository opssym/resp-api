'use strict';
'use strict';
var express = require('express');
var router = express.Router();
var ping = require ("net-ping");
var session = ping.createSession();
var dns = require('dns');

router.get('/', function(req, res) {
  dns.lookup('google.com', function onLookup(err, addresses, family) {
    session.pingHost(addresses, function (error, target, sent, rcvd) {
      var rtt = rcvd - sent;
      if (error) {
        res.status(400).json(err);
      } else {
        res.json({rtt: rtt});
      }
    });
  });
});

module.exports = router;
