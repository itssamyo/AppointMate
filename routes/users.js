var express = require('express');
var router = express.Router();


const userController = require('../controllers/user');
const meetingController = require('../controllers/meeting');

// GET request for /users redirection (incomplete)
 router.get('/', userController.user_redirect);

// GET request for admin session check
router.get('/admin', userController.admin_session_check);

// GET request for convener session check
router.get('/conv', userController.conv_session_check);

// GET request for organizer session check
router.get('/org', userController.org_session_check);

// GET request for User List (admin)
router.get('/admin/dash', userController.user_list_admin);

// GET request to manage users
router.get('/admin/manage', userController.admin_manage_users);

// POST request for Adding Users
router.post('/admin/addUser', userController.add_user);

// POST request for deleting Users
router.post('/admin/delUser', userController.delete_user);

// GET request to edit a user
router.get('/admin/editUser/:email', userController.edit_user);

// POST request to update user
router.post('/admin/updateUser', userController.update_user);

// // GET request for organizer dashboard
router.get('/org/dash', meetingController.org_dash);

// // GET request for convener dashboard
router.get('/conv/dash', meetingController.conv_dash);

// // POST request for organizer dashboard csv upload
// router.post('/org/dash', userController.org_dash_csv);

// // POST request for convener dashboard csv upload
// router.post('/conv/dash', userController.conv_dash_csv);


module.exports = router;
