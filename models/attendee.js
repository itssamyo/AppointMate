const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');

const Attendee = sequelize.define('attendees', {
    aId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

sequelize.sync({force: true})
    .then(() => console.log('[[Attendee table has been successfully created, if one doesn\'t exist]]'))
    .catch(error => console.log('This error occured', error));

    module.exports = Attendee;