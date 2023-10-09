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
    const {email, password} = req.body

    const user = await Users.findOne({where: {email: req.body.email}})
    if(user){
        const pwd_valid = await bycrpt.compare(req.body.password, user.password)
        if(pwd_valid){
            res.status(200).json(req.body)

        }else{
            res.status(400).json({message: 'Invalid Password'})
        }
    }

}

module.exports = {postUserInfo, postLoginInfo}