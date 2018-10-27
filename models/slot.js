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
        type: Sequelize.STRING,
        allowNull: true
    },
    sEnd: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true
    },
    timestamp: Sequelize.DATE
});

// sequelize.sync()
//     .then(() => console.log('[[Slot table has been successfully created, if one doesn\'t exist]]'))
//     .catch(error => console.log('Slot table  error occured', error));

    module.exports = Slot;