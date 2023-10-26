const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const User = sequelize.define('user', {
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
    isPremium : {
        type:Sequelize.BOOLEAN,
        defaultValue: false
    },
    total_cost: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})

module.exports = User;