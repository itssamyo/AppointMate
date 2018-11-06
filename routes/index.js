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
const userController = require('../controllers/user');


User.sync().then(()=>{
    Meeting.sync().then(()=>{
        UserMeeting.sync().then(()=>{
            const x = bcrypt.hashSync('1234');
            User.findOrCreate({
                where: {
                    email: 'john@mail.com'
                  }, 
                defaults: {
                  uFname: 'john',
                  uLname: 'nhoj',
                  password: x,
                  uType: 'admin'
                  }
              });
              User.findOrCreate({
                  where: {
                      email: 'adam@mail.com'
                    }, 
                  defaults: {
                    uFname: 'adam',
                    uLname: 'mada',
                    password: x,
                    uType: 'convener'
                    }
                });
          
               User.findOrCreate({
                    where: {
                      email: 'saed@mail.com'
                  },
                 defaults: {
                  uFname: 'saed',
                  uLname: 'daes',
                  password: x,
                  uType: 'organiser'
                  }
              });
        });
    }).then(()=>{
        Slot.sync().then(()=>{
            Attendee.sync();
        })
    });
  });
  

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        if(req.session.user.uType == 'admin'){
            res.redirect('/admin');
        }
        else if(req.session.user.uType == 'convener'){
            res.redirect('/users/conv/dash');
        }
        else if(req.session.user.uType == 'organiser'){
            res.redirect('/users/org/dash');
        }
    } else {
        next();
    }
  };

// GET request for Login
router.post('/login', userController.login);

// GET request for Logout
router.get('/logout', userController.logout);

// Session checker
router.get('/', sessionChecker, (req, res) => {
    res.render('index', { error: req.session.error });
});

router.get('/*', function(req, res, next){
    if(req.session.user){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});

router.get('/admin*',function(req, res, next){
    if(req.session.user.uType == 'admin'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});


// router.get('/home', function(req, res, next) {
//   res.render('home',{ error: req.session.error });
// });









module.exports = router;
