const config = require('../config/index');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.dburl);

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
        type: Sequelize.DATEONLY,
        allowNull: true
    }
});

module.exports = Meeting;
