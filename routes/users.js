var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
// const User = require('../models/user');
const User = require('../controllers/user');





/* GET users listing. */
router.get('/', function(req, res, next) {
  var item = [ {
    username: 'sdepold',
    job: 'Technical Lead JavaScript',
    id: 1,   
  },
  true ];

  res.json(item[0]);
});

// router.get('/get', User.list);
router.get('/get',User.list);

router.get('/admin', function(req, res){

  // console.log('from admin: '+req.session.result);

  if(req.session.user){
      if(req.session.user.uType =='admin'){          
          res.redirect('/users/admin/dash');
      }
  }
  else{
      res.status(404).send('Not found');        
  }
});

router.get('/admin/dash',User.list);
router.post('/admin/addUser', User.addUser);


router.post('/login', User.login);
// router.post('/testlog', User.login);


router.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/home');
  }
});








module.exports = router;
