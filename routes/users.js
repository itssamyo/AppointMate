var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
// const User = require('../models/user');
const User = require('../controllers/user');






router.get('/', function(req, res, next) {
  res.send('user type error');
});


//LOG IN - LOG OUT
router.post('/login', User.login_user);
router.get('/logout', User.logout_user);


//--ADMIN
router.get('/admin', User.admin);
router.get('/admin/dash',User.admin_dash_list_users);
router.post('/admin/addUser', User.admin_add_user);
router.get('/admin/manage', User.admin_manage_users);
// router.post('/admin/delUser', User.admin_delete_user);
router.post('/admin/delUser', function(req, res){
  console.log(req.body);
  res.send(req.body);
});
//END


//--ORGANISER
router.get('/org/dash', User.org_dashboard);
//END


//--CONVENER
router.get('/conv/dash', User.conv_dashboard);
//END


// router.get('/del', User.admin_delete_user);
router.get('/upd', User.admin_update_user);












module.exports = router;
