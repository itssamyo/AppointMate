const User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/index');

module.exports = {
    list(req, res) {
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
            }
        }
        else{
            res.status(404).send('Not found'); 
        }
    },

    login(req, res){
      var email = req.body.email,
          password = req.body.password;
            

        User.findOne({ where: { email: email } }).then(function (user) {            
          if (!user) {
              req.session.error = 'Email not found';
              res.redirect('/home');
          }else if(!user.validPassword(password)){
              req.session.error = 'Incorrect password';        
              res.redirect('/home');
          }else if(user.uType == 'admin'){
            req.session.result = 'sample result';
            req.session.user = user.dataValues;             
            res.redirect('/users/admin');
          } 
          else {
              req.session.user = user.dataValues;
              res.redirect('/dashboard');
          }
      });
    },

    addUser(req, res){
        var email = req.body.email, password = req.body.password, fname = req.body.fname,
        lname = req.body.lname, utype = req.body.utype;
        
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
    }
 
};