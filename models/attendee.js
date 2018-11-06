const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
const Slot = require('../models/slot');

const Attendee = sequelize.define('attendees', {
    aId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
            model: Slot,
            key: 'sId'
        }
    },
    aFname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    aLname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    aEmail: {
        type: Sequelize.STRING,
        allowNull: true
    },
    aLink: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

    module.exports = Attendee;
