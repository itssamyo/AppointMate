const User = require('../models/user');
const Meeting = require('../models/meeting');
// var fs = require('fs');
// var formidable = require('formidable');
const fileUpload = require('express-fileupload');



// Render Convener Dashboard
exports.conv_dash = (req, res, next) => {
    User.findAll({where: {uType: 'organiser'},
    attributes: ['email', 'uFname','uLname', 'uType', 'createdAt']
    }).then(organiser =>{
        res.render('conv-dash', {organiser});
    }); 
  };
  
  // Render Organizer Dashboard
exports.org_dash = (req, res, next) => {
    var email = req.session.user.email;
    res.render('org-dash',{email});
  };

exports.new_meeting = (req, res, next) =>{
    res.render('create-meeting');    
}

exports.create_meeting = (req, res, next) =>{

  
  res.end();
}

