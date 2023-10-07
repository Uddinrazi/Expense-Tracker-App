const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Users = sequelize.define('users', {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,

    }
})

module.exports = Users;