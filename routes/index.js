var express = require('express');
var router = express.Router();
require('dotenv').config();
var assert = require('assert');
const pg = require('pg');
const path = require('path');
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


  var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
  };

router.get('/', sessionChecker, (req, res) => {
    res.redirect('/home');
});


router.get('/home', function(req, res, next) {
  res.render('index');
});

// router.get('/get-data', function(req, res, next){
//   console.log('get data: ');
//   var arr = [];


router.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.render('dashboard');
  } else {
      res.redirect('/home');
  }
});





module.exports = router;
