const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const File = sequelize.define('file',{
    fileUrl: {
        type: Sequelize.STRING,
        allowNull: false
    }
    
})

module.exports = File;