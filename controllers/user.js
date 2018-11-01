const User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/index');

<<<<<<< HEAD
module.exports = {
    admin_dash_list_users(req, res) {
        var exists;
        if(req.session.alert){
            exists = req.session.alert;
        }        
        if(req.session.user){
            if(req.session.user.uType =='admin'){
            User.findAll({
                attributes: ['email', 'uFname', 'uType', 'createdAt']
            }).then(result => {     
                console.log(result);   
                res.render('admin-dash', {result, exists});
            });
            }
            else{
                res.status(404).send('Not found');  
            }
        }
        else{
            res.status(404).send('Not found'); 
        }
    },

    login_user(req, res){
      var email = req.body.email,
          password = req.body.password;
            
        //user switch
        User.findOne({ where: { email: email } }).then(function (user) {            
          if (!user) {
              req.session.error = 'Email not found';
              res.redirect('/home');
          }else if(!user.validPassword(password)){
              req.session.error = 'Incorrect password';        
              res.redirect('/home');
          }else if(user.uType == 'admin'){
            req.session.user = user.dataValues;             
            res.redirect('/users/admin');
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
    },

    logout_user(req, res){
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/');
        } else {
            res.redirect('/home');
        }
    },

    admin(req, res){
        if(req.session.user){
            if(req.session.user.uType =='admin'){          
                res.redirect('/users/admin/dash');
            }
        }else{
            res.status(404).send('Not found');        
        }
    },

    admin_add_user(req, res){
        var email = req.body.email, password = req.body.password, fname = req.body.fname,
        lname = req.body.lname, utype = req.body.utype;
        // res.json(req.body);
        const x = bcrypt.hashSync(password);        
        User.findOrCreate({
            where: {
              email: req.body.email
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
            }
            else{                
                res.redirect('/users/admin/dash');
            }
        });       
    },

    admin_delete_user(req, res){
        var email = req.body.email;    
        // console.log('sent: '+email);         
        // User.destroy({
        //     where: {
        //         email: email
        //     }
        // }).then(result=>{
        //     console.log(result);            
        // })
    },

    admin_update_user(req, res){
        User.update({
            uLname: 'adam'
        },{
            where: {
                uId: 2
            }
        }).then(()=>{
            res.end();
        });
        // .then(result=>{
        //     console.log(result)
        //     res.send('updated');
        // }).error(err=>{
        //     console.log(err);
        // })
    },

    org_dashboard(req, res){
        if(req.session.user){
            var email = req.session.user.email;
            res.render('org-dash',{email});
        }
        else{
            res.status(404).send('Not found'); 
        }
    },

    conv_dashboard(req, res){
        if(req.session.user){
            var email = req.session.user.email;
            res.render('conv-dash', {email});
        }
        else{
            res.status(404).send('Not found');
        }
    },

    admin_manage_users(req, res){      
          
        User.findAll({where: {uType : 'convener'},
            attributes: ['email', 'uFname', 'uLname', 'uType', 'createdAt']
        }).then(convener => {  
            User.findAll({where: {uType: 'organiser'},
            attributes: ['email', 'uFname','uLname', 'uType', 'createdAt']
            }).then(organiser =>{
                res.render('admin-manag', {convener, organiser});
            });             
            // console.log(result);   
            
        });
=======

// Redirect users from /users to /users/'user type'/dash (incomplete)
exports.user_redirect = (req, res, next) => {
  res.render('home')
};

// Login and Redirect to relevant user page
exports.login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ where: { email: email } }).then(function (user) {
    if (!user) {
      req.session.error = 'Email not found';
      res.redirect('/home');
    }else if(!user.validPassword(password)){
      req.session.error = 'Incorrect password';
      res.redirect('/home');
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
      res.redirect('/home');
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
exports.conv_check = (req, res, next) => {
  if(req.session.user){
      if(req.session.user.uType =='convener'){
          res.redirect('/users/conv/dash');
      }
  } else {
      res.status(404).send('Not found');
  }
};

// Organizer Session Check
exports.org_check = (req, res, next) => {
  if(req.session.user){
      if(req.session.user.uType =='organizer'){
          res.redirect('/users/org/dash');
      }
  } else {
      res.status(404).send('Not found');
  }
};

// Admin Login Check
exports.admin_check = (req, res, next) => {
  if(req.session.user){
      if(req.session.user.uType =='admin'){
          res.redirect('/users/admin/dash');
      }
  } else {
      res.status(404).send('Not found');
  }
};

// List Users on the Admin Dashboard
exports.user_list_admin = (req, res, next) => {
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
        res.render('admin-dash', {result, exists});
    });
    }
    else{
      res.status(404).send('Not found');
>>>>>>> master-sam
    }
  }
  else{
    res.status(404).send('Not found');
  }
};

// Add Users to AppointMate
exports.add_user = (req, res, next) => {
  var email = req.body.email, password = req.body.password, fname = req.body.fname,
  lname = req.body.lname, utype = req.body.utype;
  // res.json(req.body);
  const x = bcrypt.hashSync(password);
  User.findOrCreate({
    where: {
      email: req.body.email
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
        res.redirect('/users/admin/dash');
      }
  });
};

// Render Organizer Dashboard
exports.org_dash = (req, res, next) => {
  if(req.session.user){
      var email = req.session.user.email;
      res.render('org-dash',{email});
  }
  else{
      res.status(404).send('Not found');
  }
};

// Render Convener Dashboard
exports.conv_dash = (req, res, next) => {
  if(req.session.user){
      var email = req.session.user.email;
      res.render('conv-dash', {email});
  }
  else{
      res.status(404).send('Not found');
  }
}
