'use strict';
var request = require('supertest');
var app = require('./server');

describe('Request /', function(){
  it('Return 200', function(){
    request(app)
    .get('/')
    .expect(200)
    .end(function (err){
      if (err) throw err;
      console.log('done');
    });
  });
});
