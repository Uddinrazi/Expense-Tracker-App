const Users = require('../models/signupModel')

const postUserInfo = async(req, res, next) => {
    console.log('line c 4')
    try{
        console.log(req.body)
        console.log('line c 6')
        const data = await Users.create(req.body)
        res.status(201).json({message: "data submitted" , data })
    }
    catch(err){
        console.log(err)
    }
}

module.exports = postUserInfo;