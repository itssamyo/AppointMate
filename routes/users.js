var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const meetingController = require('../controllers/meeting');
var jwt = require('jsonwebtoken');


// GET request for admin session check
router.get('/admin', userController.admin_session_check);

// GET request for convener session check
router.get('/conv', userController.conv_session_check);

// GET request for organizer session check
router.get('/org', userController.org_session_check);

// GET request for User List (admin)
router.get('/admin/dash', userController.admin_list_users);

// GET request to manage users
router.get('/admin/manage', userController.admin_manage_users);

// GET request to view all meetings
router.get('/admin/meetings', meetingController.admin_view_meetings);

// POST request for Adding Users
router.post('/admin/addUser', userController.add_user);

// POST request for deleting Users
router.post('/admin/delUser', userController.delete_user);

// GET request to edit a user
router.get('/admin/editUser/:email', userController.edit_user);

// POST request to update user
router.post('/admin/updateUser', userController.update_user);

// GET request for organizer dashboard
router.get('/org/dash', meetingController.org_dash);

// GET request for convener dashboard
router.get('/conv/dash', meetingController.conv_dash);

//GET request for convener create new meeting page
router.get('/conv/new-meeting', meetingController.conv_new_meeting); 

//POST request for convener crate new meeting page
router.post('/conv/new-meeting', meetingController.conv_create_meeting);

// POST request for organizer dashboard csv upload
router.post('/org/dash', userController.org_dash_csv);

// POST request for convener dashboard csv upload
router.post('/conv/dash', userController.conv_dash_csv);

router.get('/conv/upload-attend', meetingController.conv_upload_attendees);

router.post('/conv/uploadattend/:meetID', meetingController.conv_create_attendees);

router.get('/conv/manage-meet', meetingController.conv_manage_meeting);

router.get('/conv/confirm-meet', meetingController.conv_confirm_meeting);

router.get('/conv/slot-status/:meetid', meetingController.conv_slot_status);

router.get('/conv/auth-org/:orgId', meetingController.conv_auth_org);

router.post('/conv/auth-org/:convId/:orgId', meetingController.conv_post_auth_org);

router.get('/conv/change-passwd', userController.change_passwd);

router.post('/conv/change-passwd', userController.update_passwd);

//org
router.get('/org/new-meeting', meetingController.org_new_meeting);

router.post('/org/new-meeting', meetingController.org_create_meeting);

router.get('/org/upload-attend', meetingController.org_upload_attendees);

router.post('/org/uploadattend/:meetID', meetingController.org_create_attendees);

router.get('/org/manage-meet', meetingController.org_manage_meeting);

router.get('/org/confirm-meet', meetingController.org_confirm_meeting);

router.get('/org/slot-status/:meetid', meetingController.org_slot_status);

router.get('/org/change-passwd', userController.change_passwd);

router.post('/org/change-passwd', userController.update_passwd);




module.exports = router;
