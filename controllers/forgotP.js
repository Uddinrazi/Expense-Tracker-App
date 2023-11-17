const uuid = require('uuid')
const bcrypt = require('bcrypt')
const Sib = require('sib-api-v3-sdk')


const User = require('../models/userM')
const ForgotPassword = require('../models/forgotP')

module.exports.forgotPassword = async(req, res, next) => {
    try{
    const {email} = req.body
    
    const user = await User.findOne({where: {email: req.body.email}})
    if(user){
        const id = uuid.v4();
       
       await user.createForgotPassword({id, active: true, userId: user.id})
      

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

 let response = await tranEmailApi.sendTransacEmail({
  sender,
  to:  receivers,
  subject: 'craete a new password',
  //text:`create a new password through this link -http://localhost:5000/password/reset-password/${id}`,
  htmlContent: `<a href="http://localhost:5000/password/reset-password/${id}">Reset password</a>`,
})

//console.log(response, 'line 43 aaaaaaaaaa')
return res.status(202).json({message: 'Link to reset password sent to your mail ', sucess: true})


    }
    else{
        throw new Error('User does not exist')
    }
}
catch(err) {
    console.log(err,'ppppppppppppp')
    return res.json({ message: err, sucess: false })
}
}

module.exports.resetPassword = async (req, res, next) => {
    const id = req.params.id;
    let fP = await ForgotPassword.findOne({where: {id}})
    if(fP){
        fP.update({active: false});
        res.status(202).send(`<html>
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
        
        const resetPassReq = await ForgotPassword.findOne({where: {id: resetpasswordid}})
        const userId = resetPassReq.userId
        console.log(userId,'uuuuuuuuuussssssss')
        let user = await User.findOne({where: {id: userId}})
        
        if(user){
            //encrypt the password 
       const saltRounds = 10; 
        bcrypt.genSalt(saltRounds, function (err, salt) { 
         if (err) { 
           console.log(err); 
           throw new Error(err); 
         } 
                // Store hash in your password DB.
                bcrypt.hash(newpassword, salt, async function (err, hash) { 
                      if (err) { 
                      console.log(err); 
                      throw new Error(err); 
                    } 
               let newpass = await user.update( {password: hash})
                console.log(newpass, 'newwwwwwwwpasssssss')
                console.log(hash,'kkkkkkkkkk')
                //console.log(user.id, 'dddddddddddiiiiiiii')
                
               res.status(201).json({messgae: 'Successfuly update the new password'})
            })
        })
    }
        else {
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

    }catch(err){
        console.log(err,'ooooooooooo')
        return res.status(403).json({ err, success: false } )
    }
}

