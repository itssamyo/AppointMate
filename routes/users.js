var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
// const User = require('../models/user');
const User = require('../controllers/user');






// router.get('/', function(req, res, next) {
  
//   res.send('user type error');
// });

// router.get('/get',User.list);

//LOG IN - LOG OUT
router.post('/login', User.login);

router.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/home');
    }
  });


//--ADMIN
router.get('/admin', function(req, res){
  if(req.session.user){
      if(req.session.user.uType =='admin'){          
          res.redirect('/users/admin/dash');
      }
  }else{
      res.status(404).send('Not found');        
  }});
router.get('/admin/dash',User.list);
router.post('/admin/addUser', User.addUser);
//END


//--ORGANISER
router.get('/org/dash', User.orgdash);
//END


//--CONVENER
router.get('/conv/dash', User.convdash);
//END














module.exports = router;
