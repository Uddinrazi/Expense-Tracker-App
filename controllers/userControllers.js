const Users = require('../models/signupModel')

function isStringInvalid(string){
    if(string == undefined ||  string.length ===0 )
    return true
    else
    return false
}

const postUserInfo = async(req, res, next) => {
    
    try{
        const {name, email, password} = req.body
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
        return res.status(400).json({err: 'Bad credential, something is missing'})
        }
        const data = await Users.create(req.body)
        res.status(201).json({message: "data submitted" , data })
    }
    catch(err){
        console.log(err)
    }
}

module.exports = postUserInfo;