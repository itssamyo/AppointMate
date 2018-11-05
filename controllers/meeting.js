const User = require('../models/user');
const Meeting = require('../models/meeting');
var formidable = require('formidable');
var fs = require('fs');
var csv = require('fast-csv');



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

  var form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './public/uploads/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');        
    });      
    let csvStream = csv.fromPath(newpath, { headers: true })
    .on('data', function(record){
      console.log(record.email);
    }).on('end', function(){
      console.log('job done');
      res.end();
    }).on('error', function(err){
      console.log(err);
    }); 
});


}

