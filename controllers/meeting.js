const User = require('../models/user');
const Meeting = require('../models/meeting');
const Attendee = require('../models/attendee');
const Slot =  require('../models/slot');
const UserMeet = require('../models/usermeeting');
var formidable = require('formidable');
var fs = require('fs');
var csv = require('fast-csv');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var nodemailer = require('nodemailer');
const ics = require('ics');
const { writeFileSync } = require('fs')



// Render Convener Dashboard
exports.conv_dash = (req, res, next) => {

    var userid = req.session.user.uId;
    User.findAll({where: {uType: 'organiser'},
    attributes: ['email', 'uFname','uLname', 'uType', 'createdAt']
    }).then(organiser =>{
        UserMeet.findAll({
          where: {
            uId: userid
          }, attributes: ['mId']
        }).then(usermeet=>{
           var meeting = {}
           var len = usermeet.length;           
           var num=0;
           var meeting = "";
           console.log('usermeet length: '+len);
            if(usermeet.length>0){
            for(var i=0;i<usermeet.length;i++){
              console.log(usermeet[i].mId);
              meetingid = usermeet[i].mId;
              
              Meeting.findAll({
                where:{
                  mId: meetingid
                }
              }).then(meetings=>{                
                meeting[num] = meetings;
                num++;
                if(num == len){
                  // res.json(sample);
                  res.render('conv-dash', {organiser, meeting}); 
                }
              })             
            }   
          }
          else{
            res.render('conv-dash', {organiser, meeting});
          }          
          })          
    
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
var userID = req.session.user.uId;
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
      UserMeet.findOrCreate({
        where: {
          uId: userID,
          mId: meetID
        }, defaults: {}
      }).spread((usermeet, created) => {
        console.log(usermeet.get({
          plain: true
        }))
        console.log(created)
      }).then(()=>{
        req.session.meetID = meetID;
        res.redirect('/users/conv/upload-attend');
      })
    })
},

exports.upload_attendees = (req, res, next) => {  
  var meetID = req.session.meetID;
  // console.log('meeting id: '+meetID);
  res.render('conv-upload-attend', { meetID });
},

exports.create_attendees = (req, res, next) =>{
  console.log('meeting id: '+ req.params.meetID);
  var meetID = req.params.meetID;
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './public/uploads/' + files.filetoupload.name+'-'+Date.now();
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      // res.write('File uploaded and moved!');            
    })
    var count = 0;
    let csvStream = csv.fromPath(newpath, { headers: true })
    .on('data', function(record){  

      csvStream.pause();
      Attendee.findOrCreate({
        where: {
          aEmail: record.email,
          mId: meetID
        }, defaults: {
          aFname: record.firstname,
          aLname: record.lastname
        }
      }).spread((attendee, created) => {
        console.log(attendee.get({
          plain: true
        }))
        console.log('created:'+ created)
        count++;
        if(count == 4){
          req.session.meetID = meetID;
          res.redirect('/users/conv/manage-meet');
        }
      })
      csvStream.resume();
    }).on('end', function(){
      console.log('job done'); 

      try {
        fs.unlinkSync(newpath);
        console.log('--successfully deleted csv file');
      } catch (err) {
        console.log('Error removing csv file');
      }
      // res.send('working till here');
      // req.session.meetID = meetID;
      // res.redirect('/users/conv/manage-meet');
    }).on('error', function(err){
      console.log(err);
    }); 
})
},

exports.conv_manage_meeting = (req, res, next) => {
  console.log('meeting id lat: '+req.session.meetID);
  
  console.log('attendees accessible?');
  Attendee.findAll({
    where: {
      mId: req.session.meetID
    }, attributes: ['aFname', 'aLname', 'aEmail']
  }).then(attendee=>{    
    Slot.findAll({
      where:{
        mId: req.session.meetID
      }, attributes: ['sStart', 'sEnd']
    }).then(slot =>{
      res.render('conv-manage-meet', {attendee, slot});
    })    
  })
}

exports.conv_confirm_meeting = (req, res, next) =>{
  var meetid = req.session.meetID;
  var sample = {}

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email,
      pass: config.password
    }
  }); 

  Meeting.findOne({
    where: {
      mId: meetid
    }, attributes: ['mId','mDesc', 'mName', 'location', 'mDate']
  }).then(meeting=>{
    console.log(meeting)
    var meetID = meeting.mId
    // res.json(meeting.mDesc);
    Attendee.findAll({
      where: {
        mId: meetid
      }, attributes: ['aId', 'aEmail']
    }).then(attendee=>{
      for(var i=0;i<attendee.length;i++){
        var attenId = attendee[i].aId;
        console.log('attendeeeeeID: '+attenId)
        var token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),          
          mId: meetid,
          aId: attenId,
        }, config.secret);

        var mailOptions = {
          from: 'youremail@gmail.com',
          to: attendee[i].aEmail,
          subject: 'Meeting Request',
          html: 'MEETING INFORMATION <br><br> Name: '
          + meeting.mName + '<br> Description: ' + meeting.mDesc + '<br> Location: ' + meeting.location
          + ' <br> Please open the following link to select your time slot: <br>' 
          + 'http://localhost:3000/attendee/'+token
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log('email-send-error-to: '+attendee[i].aEmail+' : '+error);          
          } else {
            console.log('Email sent-to: '+attendee[i].aEmail+' : '+ info.response);            
          }
        })
        if(i == attendee.length-1){
          res.redirect('/users/conv/dash');
        }
      } //end if 
    })
  })
}

exports.attendee_slot_selec = (req, res, next) =>{
  var token  = req.params.token;
  // console.log('token: '+token)
  var decoded = jwt.verify(token, config.secret);
  // console.log('decoded: '+decoded);
  var aid = decoded.aId;
  var mid = decoded.mId;
  console.log('aid: '+aid+'|| mid: '+mid);
   
  Slot.findOne({
    where: {
      aId: aid
    }
  }).then(fslot=>{

    if(fslot != null){
      res.send('Sorry, you have already confirmed your slot')
    }
    else{
      Slot.findAll({
        where: {
          mId: mid
        }
      }).then(slots=>{
        // res.json(slots);
        res.render('attend_slot_selec', { slots, aid }) 
      })
    }
  })
}

exports.attendee_confirm_slot = (req, res, next) => {
  var aid = req.params.aid;
  var sid = req.body.slot;
  // res.json(sid);
  Slot.update({
    aId: aid,
    status: 'booked'
  },{
    where:{
      sId: sid
    }
  }).then(result=>{
    console.log('update result: '+result);
    Slot.findOne({
      where: {
        sId: sid
      }
    }).then(slots=>{
      var mid = slots.mId;
      Attendee.findOne({
        where: {
          aId: aid
        }
      }).then(attendee=>{
        UserMeet.findOne({
          where: {
            mId: mid
          }
        }).then(usermeet=>{
          var uid = usermeet.uId;
          User.findOne({
            where: {
              uId: uid
            }
          }).then(user=>{
              Meeting.findOne({
                where: {
                  mId: mid
                }
              }).then(meeting=>{
                
                //getting slot start time
                var stime = slots.sStart;                
                var rstime = stime.replace(/:/g , "");
                var shour="",sminute="";
                for(var i=0;i<rstime.length;i++){
                  if(i<=1){
                    shour+=rstime[i];
                  }
                  else if(i<=3){
                    sminute+=rstime[i];
                  }
                }
              
                // res.send(sminute);

                //getting slot end time
                var etime = slots.sEnd;
                var retime = etime.replace(/:/g, "");
                var ehour="", eminute="";
                for(var i=0;i<retime.length;i++){
                  if(i<=1){
                    ehour+=retime[i];
                  }
                  else if(i<=3){
                    eminute+=retime[i];
                  }
                }
                
                //getting date 
                var date = meeting.mDate;
                var rdate = date.replace(/-/g, "");                
                var y="", m="", d="";
                for(var i=0;i<rdate.length;i++){
                  if(i<=3){
                    y = y+rdate[i];
                  }
                  else if(i<=5){
                    m = m+rdate[i];
                  }
                  else{
                    d = d+rdate[i];
                  }                
                }
                
                var strM = parseInt(sminute);
                var endM = parseInt(eminute);
                const event = {
                  start: [y, m, d, shour, strM],
                  end: [y, m, d, ehour, endM],
                  title: meeting.mName+' with '+attendee.aFname+' '+attendee.aLname,
                  description: meeting.mDesc,
                  location: meeting.location,
                  status: 'CONFIRMED'
                }
                var icspath = './public/ics/event'+Date.now()+'.ics';
                ics.createEvent(event, (error, value) => {
                  if (error) {
                    console.log(error)
                    res.send('error creating ics file')
                  }else{
                    console.log(value) 
                    writeFileSync(icspath, value)

                    var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: config.email,
                        pass: config.password
                      }
                    }); 

                    var mailOptions = {
                      from: 'appointmate@gmail.com',
                      to: attendee.aEmail+','+ user.email,
                      subject: meeting.mName+' outlook clendar',
                      text: 'Please download the attached file to add to Outlook',
                      attachments: [{
                        path:icspath
                      }]
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log('email-send-error'+error);
                      } else {
                        console.log('Email sent: ' + info.response);

                        try {
                          fs.unlinkSync(icspath);
                          console.log('--successfully deleted ics file');
                        } catch (err) {
                          console.log('Error removing ics file');
                        }
                      }
                    });

                    res.send('Thank you for your time. Please close the tab');
                  }
                })
              })
          })          
        })
      })
    })
  })  
}

exports.conv_slot_status = (req, res, next) => {
  var meetId = req.params.meetid;
  Slot.findAll({
    where: {
      mId: meetId
    }
  }).then(slots=>{
    
    Attendee.findAll({
      where: {
        mId: meetId
      }
    }).then(attendees=>{
      res.json(attendees);
      res.render('conv-slot-status', { slots, attendees });
    })
    
  })

}

exports.test_ics = (req, res, next) => {
  // var str = "02:00:00";
  // var ress = str.replace(/:/g , ",");
  // console.log('rtime: '+ress);
  var y = "2018";
  var h = "04";
  const event = {
    start: [y, 12, 30, h, 30],
    end: [y, 12, 30, 7, 30],
    title: 'Meeting with (attendee)',
    description: 'Annual 10-kilometer run in Boulder, Colorado',
    location: 'Folsom Field, University of Colorado (finish line)',
    status: 'CONFIRMED',
    organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
    attendees: [
    { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true },
    { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton' }
  ]
  }
  var path = './public/ics/event'+Date.now()+'.ics';
  ics.createEvent(event, (error, value) => {
    if (error) {
      console.log(error)
      res.send('error creating ics')
    }else{
      console.log(value) 
      writeFileSync(path, value)
      res.send('done');
    }
  })
}


exports.test_token = (req, res, next) => {

  var token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    aId: "4",
    mId: 5
  }, config.secret);

  var decoded = jwt.verify(token, config.secret);
  var out;
  if(decoded.mId == 5){
    out = true;
  }
  else{
    out = false
  }
  res.json(decoded);
}

exports.test_mail = (req, res, next) => {
  var name = 'monish';

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email,
      pass: config.password
    }
  }); 

  var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'prithivi.monish@gmail.com',
    subject: 'Sending Email using Node.js',
    html: 'mail from:  ' + name,
    attachments: [{
      path:'./public/ics/event1541991998049.ics'
    }]
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('email-send-error'+error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })

  res.end();
}