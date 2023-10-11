const Users = require('../models/signupModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
function isStringInvalid(string){
    if(string == undefined ||  string.length ===0 )
    return true
    else
    return false
}

const postUserInfo = async(req, res, next) => {
    
    try{
        const {name, email, password} = req.body
        //console.log(req.body.email)
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
        return res.status(400).json({err: 'Bad credential, something is missing'})
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) => {
            
        await Users.create({name, email, password: hash})
        res.status(201).json({message: "New user craeted"})
        })
      
    }
    catch(err){
        console.log(err)
    }
}

function generateAccessToken(id, name){
    return jwt.sign({userId : id, name:name}, 'jdfkjskjfndi83eeu873g28uew')
}


const postLoginInfo = async (req, res, next) => {
    const {email,password} = req.body
    //console.log('print line 30')
    
    if(isStringInvalid(email) || isStringInvalid(password)){
        res.status(400).json({message: 'some thing is missing'})
    }
    const user = await Users.findAll({where: {email: email}})
    if(user.length >0){
        bcrypt.compare(password, user[0].password, (err, result) => {
            if(err){
                throw new Error()
            }
        if(result === true){
       
        res.status(200).json({success:true, message: 'login successful', token: generateAccessToken(user[0].id, user[0].name)})
        
    }else{
        return res.status(400).json({success: false, message: 'Incorrect password'})
        
        }
    })
}
        else{
            res.status(404).json({message: 'User does not exist'})
        }
    
}



module.exports = {postUserInfo, postLoginInfo}