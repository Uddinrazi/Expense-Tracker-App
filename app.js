const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./util/db')
const path = require('path')
const app = express()

app.use(express.json())
const signupRoutes = require('./routes/userRoutes')

//app.use(express.static(path.join(__dirname, "/public")))


app.use(cors)


app.post('/user',async(req, res, next) => {
    
    try{
        console.log(req.body)
        console.log('line c 6')
        const data = await Users.create(req.body)
        res.status(201).json({message: "data submitted" , data })
    }
    catch(err){
        console.log(err)
    }
});


sequelize.sync({force: false})
.then((result) => {
    console.log('db connected')
    app.listen(5000, () => {
        console.log('listening on 5000')
    })
    
}).catch(err => {
    console.log(err)
})
