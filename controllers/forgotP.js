const uuid = require('uuid')
const bycrypt = require('bcrypt')
const Sib = require('sib-api-v3-sdk')

const User = require('../models/userM')
const ForgotPassword = require('../models/forgotP')

module.exports.forgotPassword = async(req, res, next) => {
    try{
    const {email} = req.body
    console.log(email,'line 11 emaillllllllll')
    const user = await User.findOne({where: {email: req.body.email}})
    if(user){
        const id = uuid.v4();
        console.log(id, 'line 15 idddddd')
       user.createForgotPassword({id, active: true})
       /*.catch(err => {
            throw new Error(err)
        }) */

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY

const tranEmailApi = new Sib.TransactionalEmailsApi()
const sender = {
  email: 'uddinrazi88@gmail.com'
}

const receivers = [{
  email: email
}]

 tranEmailApi.sendTransacEmail({
  sender,
  to:  receivers,
  subject: 'craete a new password',
  textContent:`Kindly create a new password through this link`,
  html: `<a href="http://localhost:5000/password/reset-password/${id}">Reset password</a>`,
}).then((response) => {
return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
}).catch(console.log)

    }
    else{
        throw new Error('User does not exist')
    }
}
catch(err) {
    console.log(err)
    return res.json({ message: err, sucess: false })
}
}

module.exports.resetPassword = async (req, res, next) => {
    const id = req.params.id;
    let fP = await ForgotPassword.findOne({where: {id}})
    if(fP){
        fP.update({active: false});
        res.status(200).send(`<html>
        <script>
        function formsubmitted(e){
            e.preventDefault();
            console.log('called')
        }
    </script>
    <form action="/password/update-password/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>
        `)
        res.end();
    }
}


module.exports.updatePassword = async (req, res, next) => {
    try{
        const {newpassword} = req.query;
        const {resetpasswordid} =  req.params
        //req.body.userId = req.user.id;
        const resetPassReq = await ForgotPassword.findOne({where: {id: resetpasswordid}})
        
        let user = await User.findOne({where: {id: resetPassReq.userId}})
        console.log()
        if(user){
            const saltRounds = 10;
            bycrypt.genSalt(saltRounds, async function(err,hash){
                if(err){
                    console.log(err)
                    throw new Error(err)
                }
               await User.update({password:hash})
               res.status(201).json({messgae: 'Successfuly update the new password'})
            })
        }
        else {
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

    }catch(err){
        console.log(err)
        return res.status(403).json({ err, success: false } )
    }
}

