const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
const Meeting = require('../models/meeting');

const Slot = sequelize.define('slots', {
    sId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: Meeting,
            key: 'mId'
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
