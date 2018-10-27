var express = require('express');
var router = express.Router();
require('dotenv').config();
var assert = require('assert');
const pg = require('pg');
const path = require('path');
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
const User = require('../models/user');
const Slot = require('../models/slot');
const Meeting = require('../models/meeting');
const Attendee = require('../models/attendee');
var bcrypt = require('bcryptjs');
const UserMeeting = require('../models/usermeeting');


  User.sync();
  Meeting.sync();
  Slot.sync();
  Attendee.sync();
  UserMeeting.sync();  
  const x = bcrypt.hashSync('1234');
  User.findOrCreate({
      where: {
          username: 'john'
        }, 
      defaults: {
          job: 'Technical Lead JavaScript',
          password: x,
        email: 'john@mail.com',
        uType: 'admin'
        }
    });


// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


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
  res.render('home',{ error: req.session.error });
});

router.get('/admin', function(req, res){
    if(req.session.user){
        if(req.session.user.uType =='admin'){
            res.render('admin');
        }
    }
    else{
        res.status(404).send('Not found');        
    }
});


router.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.render('dashboard');
  } else {
      res.redirect('/home');
  }
});







module.exports = router;
