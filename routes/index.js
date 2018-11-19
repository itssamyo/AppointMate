var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Slot = require('../models/slot');
const Meeting = require('../models/meeting');
const Attendee = require('../models/attendee');
const UserMeeting = require('../models/usermeeting');
const userController = require('../controllers/user');
const meetingController = require('../controllers/meeting');
var bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');

User.sync().then(()=>{
    Meeting.sync()
    .then(()=>{
       
        userController.up;
        
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
                      email: 'prithivi.monish@yahoo.in'
                    }, 
                  defaults: {
                    uFname: 'prithivi',
                    uLname: 'monish',
                    password: x,
                    uType: 'convener'
                    }
                });
          
               User.findOrCreate({
                    where: {
                      email: 'danieltdaemon@gmail.com'
                  },
                 defaults: {
                  uFname: 'daniel',
                  uLname: 'daemon',
                  password: x,
                  uType: 'organiser'
                  }
              });
        });
        //end


    }).then(()=>{
        Attendee.sync().then(()=>{
            Slot.sync();
        })
    });
  });
  

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        if(req.session.user.uType == 'admin'){
            res.redirect('/users/admin');
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
    res.render('index', { error: req.session.error});
});

router.get('/users', sessionChecker, (req, res) => {
    res.redirect('/');
})

router.get('/attendee/:token', meetingController.attendee_slot_selec);

router.post('/attendee/confirm-slot/:aid/:conv', meetingController.attendee_confirm_slot);

// router.get('/testtoken', meetingController.test_token);
router.get('/testmail', meetingController.test_mail);
// router.get('/testics', meetingController.test_ics);

router.get('/*', function(req, res, next){
    if(req.session.user){
        next();
    }
    else{
        res.redirect('/');
    }
});

router.get('/users/admin*',function(req, res, next){
    if(req.session.user.uType == 'admin'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});

router.get('/users/conv*', function(req, res, next){
    if(req.session.user.uType == 'convener'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});

router.get('/users/org*', function(req, res, next){
    if(req.session.user.uType == 'organiser'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});











module.exports = router;
