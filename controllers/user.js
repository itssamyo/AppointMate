const User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/index');

module.exports = {
    list(req, res) {
         User.findAll({
            attributes: ['username', 'password']
          }).then(result => {
        
            console.log(result);
        
            res.json(result);
          });
    },

    login(req, res){
      var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { username: username } }).then(function (user) {
          if (!user) {
              res.redirect('/home');
          }else if(!user.validPassword(password)){        
              res.redirect('/home');
          } else {
              req.session.user = user.dataValues;
              res.redirect('/dashboard');
          }
      });
    }

//...............
    // login(req, res){
    //     var item = {
    //         user: req.body.username,
    //         passw: req.body.password
    //     };
    //     console.log(item);
    //     User.findOne({
    //         where: {
    //           username: item.user
    //         }
    //       }).then(user =>{
    //         if (!user) {
    //             var message = 'Incorrect credentials';
    //           return res.json(message);
    //         }
    //         else if(!bcrypt.compareSync(item.passw, user.password)){
    //             var message = 'Incorrect password';
    //             return res.json(message);
    //         }
    //         else{
    //           // var token = jwt.sign({username: req.body.username, iat: Math.floor(Date.now() / 1000) - 30 }, config.secret);                      
    //             // res.send({
    //             //   success: true,
    //             //   message: 'Login Success!',
    //             //   data: user,
    //             //   token: token
    //             //  });
    //             res.redirect('/orgn');
    //         }
    //      });
    // }
    

};