const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Expense = sequelize.define('expense', {
    amount:{
        type: Sequelize.INTEGER,
        allowNull: false
    },

    description:{
        type: Sequelize.STRING,
        allowNull: false
    },

    category: {
       type: Sequelize.STRING,
       allowNull: false 
    }
})

module.exports = Expense;
