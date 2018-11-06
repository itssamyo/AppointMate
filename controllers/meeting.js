const User = require('../models/user');
const Meeting = require('../models/meeting');
const Slot =  require('../models/slot');
var formidable = require('formidable');
var fs = require('fs');
var csv = require('fast-csv');
const Sequelize = require('sequelize');



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
 var item = {
   name : req.body.eventname,
   loc : req.body.location,
   desc:  req.body.description,
   date: req.body.eventdate,
   s1start: req.body.s1start,
   s1end: req.body.s1end,
   s2start: req.body.s2start,
   s2end: req.body.s2end,   
   s3start: req.body.s3start,
   s3end: req.body.s3end,
   s4start: req.body.s4start,
   s4end: req.body.s4end,
   s5start: req.body.s5end,
   s5end: req.body.s5end
 }
 console.log(req.body);
var meetID;
Meeting.findOrCreate({
  where: {
    mName: item.name
  }, defaults: {
    mName: item.name,
    mDesc: item.desc,
    location: item.loc,
    mDate: item.date    
  }
  }).spread((meeting, created) => {
    console.log(meeting.get({
      plain: true
    }))
    console.log(created)
    meetID = meeting.mId;
  }).then(()=>{  
    console.log('first slot entry');   
    Slot.findOrCreate({
      where: {
        sStart: item.s1start,
        sEnd: item.s1end,
        mId: meetID
      }, defaults: {
        status: 'pending', 
      }
    })

    if(item.s2start != ""){
      console.log('second slot entry');
      Slot.findOrCreate({
        where: {
          sStart: item.s2start,
          sEnd: item.s2end,
          mId: meetID
        }, defaults: {
          status: 'pending'
        }
      })
    }

    if(item.s3start != ""){
      console.log('third slot entry');
      Slot.findOrCreate({
        where: {
          sStart: item.s3start,
          sEnd: item.s3end,
          mId: meetID
        }, defaults: {
          status: 'pending'
        }
      })
    }

    if(item.s4start != ""){
      console.log('fourth slot entry');
      Slot.findOrCreate({
        where: {
          sStart: item.s4start,
          sEnd: item.s4end,
          mId: meetID
        }, defaults: {
          status: 'pending'
        }
      })
    }

    if(item.s5start != ""){
      console.log('fifth slot entry');
      Slot.findOrCreate({
        where: {
          sStart: item.s5start,
          sEnd: item.s5end,
          mId: meetID
        }, defaults: {
          status: 'pending'
        }
      })
    }

    }).then(()=>{      
    res.render('conv-conf-meet', { meetID });
    })
  
},

exports.create_attendees = (req, res, next) =>{

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

