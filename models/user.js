const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
var bcrypt = require('bcryptjs');



///---CREATE
const User = sequelize.define('users', {
  username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
  },
  email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  }
});


User.beforeCreate = function(user){
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);
};

User.prototype.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};
  
  
  //force: true will drop the table if it already exists
  // User.sync({force: true}).then(() => {
  //   // Table created
  //   const x = bcrypt.hashSync('1234');
  //     User.create({
  //     username: 'john',
  //     password: x
  //   });
  //   const y = bcrypt.hashSync('1234');
  //     User.create({    
  //       username: 'mary',
  //       password: y
  //     });
  
  // });

  sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

   

// export User model for use in other files.
module.exports = User;
  


///-----------------------------------------------------------
// sequelize.query("SELECT * FROM users").then(myTableRows => {
//   console.log(myTableRows);
// });

///---READ
// User.findById(1).then(user => {
//   console.log('from find by id: ');
//   console.log(user.firstName + ' '+ user.lastName);
//   // project will be an instance of Project and stores the content of the table entry
//   // with id 123. if such an entry is not defined you will get null
// })


//   User.findAll({
//     attributes: ['username', 'password']
//   }).then(result => {

//     console.log(result);

//     res.json(result);
//   });
// });