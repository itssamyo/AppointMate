const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');

const Meeting = sequelize.define('meetings', {

    mId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    mDesc: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    mName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },
    mDate: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    noOfSlots: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// sequelize.sync()
//     .then(() => console.log('[[Meeting table has been successfully created, if one doesn\'t exist]]'))
//     .catch(error => console.log('This error occured', error));

module.exports = Meeting;
