const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
var bcrypt = require('bcryptjs');



///---CREATE
const User = sequelize.define('users', {
  uId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
  email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  },
  uFname: {
      type: Sequelize.STRING,
      allowNull: true
  },
  uLname: {
      type: Sequelize.STRING,
      allowNull: true
  },
  uType: {
    type: Sequelize.STRING,
    allowNull: true
  },
});


User.beforeCreate = function(user){
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);
};

User.prototype.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};


// export User model for use in other files.
module.exports = User;
