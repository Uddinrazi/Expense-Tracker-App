
const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const ForgotPassword = sequelize.define('forgotPassword' , {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = ForgotPassword;