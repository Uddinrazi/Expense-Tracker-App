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

    },
    isPremium : Sequelize.BOOLEAN,
    total_cost: {
        type: Sequelize.INTEGER,
        default: 0
    }
})

module.exports = Users;