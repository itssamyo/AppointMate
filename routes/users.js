var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
// const User = require('../models/user');
const userController = require('../controllers/user');

// GET request for /users redirection (incomplete)
 router.get('/', userController.user_redirect);

// GET request for Login
router.post('/login', userController.login);

// GET request for Logout
router.get('/logout', userController.logout);

// GET request for admin session check
router.get('/admin', userController.admin_session_check);

// GET request for convener session check
router.get('/conv', userController.admin_session_check);

// GET request for organizer session check
router.get('/org', userController.admin_session_check);

// GET request for User List (admin)
router.get('/admin/dash', userController.user_list_admin);

//POST request for Adding Users
router.post('/admin/addUser', userController.add_user);

// GET request for organizer dashboard
router.get('/org/dash', userController.org_dash);

// GET request for convener dashboard
router.get('/conv/dash', userController.conv_dash);

module.exports = router;
