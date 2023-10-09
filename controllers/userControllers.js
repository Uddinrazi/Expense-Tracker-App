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
        //console.log(req.body.email)
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


const postLoginInfo = async (req, res, next) => {
    const {email,password} = req.body
    //const password = req.body.password;
    console.log(req.body)
    console.log('print line 30')
    
    const user = await Users.findOne({where: {email: email, password: password}})
    if(user){
        if(user.password === password){
        res.status(200).json({success:true, message: 'login successful'})
        }else{
        return res.status(400).json({success: false, message: 'Inconnect password'})
        
        }
    }
        else{
            res.status(404).json({message: 'User does not exist'})
        }
    
}



module.exports = {postUserInfo, postLoginInfo}