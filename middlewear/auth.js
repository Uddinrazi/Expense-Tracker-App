const jwt = require('jsonwebtoken')
const Users = require('../models/signupModel')

const authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization')
//console.log(token, 'hey m token')
            
        const user = jwt.verify(token,'jdfkjskjfndi83eeu873g28uew')
       console.log(user.userId,'m user id ')
        Users.findByPk(user.userId).then(user => {
           
            req.user = user;
            next();
        }).catch(err => {
            throw new Error(err)
    })
}catch(err){
        console.log(err)
    }
}

module.exports = authenticate;