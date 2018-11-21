const User = require('../models/user');
var bcrypt = require('bcryptjs');
var multer = require('multer');
const Sequelize = require('sequelize');
var nodemailer = require('nodemailer');
var config = require('../config/index');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage });




// Login and Redirect to relevant user page
exports.login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ where: { email: email } }).then(function (user) {
    if (!user) {
      req.session.error = 'Email not found';
      res.redirect('/');
    }else if(!user.validPassword(password)){
      req.session.error = 'Incorrect password';
      res.redirect('/');
    }else if(user.uType == 'admin'){
      req.session.user = user.dataValues;
      res.redirect('/users/admin/dash');
    }
    else if(user.uType == 'organiser'){
      req.session.user = user.dataValues;
      res.redirect('/users/org/dash');
    }
    else if(user.uType == 'convener') {
      req.session.user = user.dataValues;
      res.redirect('/users/conv/dash');
    }
    else{
      res.send('Error! user type not found');
    }
  });
};

// Logout
exports.logout = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
  } else {
      res.redirect('/');
  }
};

// Admin Session Check
exports.admin_session_check = (req, res, next) => {
  if(req.session.user){
      if(req.session.user.uType =='admin'){
          res.redirect('/users/admin/dash');
      }
  } else {
      res.status(404).send('Not found');
  }
};

// Convener Session Check
exports.conv_session_check = (req, res, next) => {
  if(req.session.user){
      if(req.session.user.uType =='convener'){
          res.redirect('/users/conv/dash');
      }
  } else {
      res.status(404).send('Not found');
  }
};

// Organizer Session Check
exports.org_session_check = (req, res, next) => {
  if(req.session.user){
      if(req.session.user.uType =='organizer'){
          res.redirect('/users/org/dash');
      }
  } else {
      res.status(404).send('Not found');
  }
};

// List Users on the Admin Dashboard
exports.admin_list_users = (req, res, next) => {
  var exists;
  if(req.session.alert){
    exists = req.session.alert;
  }
  if(req.session.user){
    if(req.session.user.uType =='admin'){
    User.findAll({
        attributes: ['email', 'uFname','uType', 'createdAt']
    }).then(result => {
        console.log(result);
        res.render('admin-dash', {result, exists, usert: req.session.user.uType});
    });
    }
    else{
      res.status(404).send('Not found');
    }
  }
  else{
    res.status(404).send('Not found');
  }
};

// Add Users to AppointMate
exports.add_user = (req, res, next) => {
  var email = req.body.email, 
  password = req.body.password, 
  fname = req.body.fname,
  lname = req.body.lname, 
  utype = req.body.utype;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    auth: {
      user: config.email,
      pass: config.password
    }
  }); 
  
  const x = bcrypt.hashSync(password);
  User.findOrCreate({
    where: {
      email: email
    },
      defaults: {
      password: x,
      uFname: fname,
      uLname: lname,
      uType: utype
      }
  }).spread((user, created) => {
      console.log(user.get({plain: true}))
      console.log('created: '+created);
      var exists;
      if(created == false){
        exists = true;
        req.session.alert = exists;
        res.redirect('/users/admin/dash');
      } else {
        var mailOptions = {
            to: email,
            subject: 'Appointmate User Account',
            html: 'Congradulations, a '+ utype +' account has been created for you in Appointmate.'+
            '<br>Please use the following information to login.<br>'+
            'USERNAME: &nbsp;'+ email + '<br>PASSWORD: &nbsp;'+ password,            
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log('email-send-error'+error);
            } else {
              console.log('Email sent: ' + info.response);
              
            }
          });
        res.redirect('/users/admin/dash');
      }
  });
};

exports.delete_user = (req, res, next) => {
    var email = req.body.email;
    User.destroy({
        where: {
            email: email
        }
    }).then(result=>{
        console.log(result);
        res.redirect('/users/admin/manage');
    })

},

exports.edit_user = (req, res, next) =>
{
    var email = req.params.email;
    User.findOne({where: {email: email}}).then(function(user){
        console.log(user);
        res.render('edit-user', {user, usert: req.session.user.uType});
    });
},


exports.update_user = (req, res, next) =>{
    console.log(req.body.firstname);
    User.update({
        uFname: req.body.firstname,
        uLname: req.body.lastname,
        uType: req.body.usertype
    },{
        where: {
            email: req.body.email
        }
    }).then(result=>{
        console.log(result);
        res.redirect('/users/admin/manage');
    });
},

// Render Organizer Dashboard
exports.org_dash = (req, res, next) => {
  if(req.session.user){
      var email = req.session.user.email;
      res.render('org-dash',{email, usert: req.session.user.uType});
  }
  else{
      res.status(404).send('Not found');
  }
};

// Render Convener Dashboard
exports.conv_dash = (req, res, next) => {
  if(req.session.user){
      var email = req.session.user.email;
      res.render('conv-dash', {email, usert: req.session.user.uType});
  }
  else{
      res.status(404).send('Not found');
  }
};

// Admin user management
exports.admin_manage_users = (req, res, next) => {
     User.findAll({where: {uType : 'convener'},
            attributes: ['email', 'uFname', 'uLname', 'uType', 'createdAt']
        }).then(convener => {
            User.findAll({where: {uType: 'organiser'},
            attributes: ['email', 'uFname','uLname', 'uType', 'createdAt']
            }).then(organiser =>{
                res.render('admin-manage', {convener, organiser, usert: req.session.user.uType});
            });

        });
};

// Upload CSV (organizer)
exports.org_dash_csv = (req, res, next) => {
    var upload = multer({ storage : storage}).single('csvFile');
      upload(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
              console.log('error', err);
              next(err);
          }
          res.end("File is uploaded");
      });
  };
  
  // Upload CSV (convener)
  exports.conv_dash_csv = (req, res, next) => {
    var upload = multer({ storage : storage}).single('csvFile');
      upload(req,res,function(err) {
          if(err) {
              return res.end("Error uploading file.");
              console.log('error: '+err);
              next(err);
          }
          res.end("File is uploaded");
      });
  };

  exports.change_passwd = (req, res, next) => {
    res.render('edit-passwd', { usert: req.session.user.uType});
  }

  exports.update_passwd = (req, res, next) => {
      var passwd = req.body.password;
      var newPasswd = req.body.newPassword;
      var confNewPasswd = req.body.confirmPassword;
      var userid = req.session.user.uId;
      var error = "";
      User.findOne({
          where: {
              uId: userid
          }
      }).then(user=>{
          if(!user.validPassword(passwd)){
              res.render('edit-passwd', { error: "Password Incorrect" , usert: req.session.user.uType})
          }
          else if(newPasswd != confNewPasswd){
              res.render('edit-passwd', {error: "New password does not match", usert: req.session.user.uType})
          }
          else{
            var passx = bcrypt.hashSync(newPasswd);
            User.update({
                password: passx
            },{
              where:{
                uId: userid
              }  
            }).then(result=>{
                console.log('result:'+result);
                res.redirect('/');
            })
          }
          
      })
      
    //   res.json(req.body);
  }
  
