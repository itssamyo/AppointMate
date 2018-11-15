const config = require('../config/index');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.dburl);
const Meeting = require('../models/meeting');
const Attendee = require('../models/attendee');

const Slot = sequelize.define('slots', {
    sId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        foreignKey: true,
        references: {
            model: Meeting,
            key: 'mId'
        }
      },
    aId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: Attendee,
            key: 'aId'
        }
    },
    sStart: {
        type: Sequelize.TIME,
        allowNull: true
    },
    sEnd: {
        type: Sequelize.TIME,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true
    }
});
    module.exports = Slot;
