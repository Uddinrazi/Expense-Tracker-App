const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./util/db')
const path = require('path')
const app = express()

app.use(express.json())
const signupRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')

const Users = require('./models/signupModel')
const Expense = require('./models/expenseModels')


app.use(express.static(path.join(__dirname, "/public")))


app.use(cors())
app.use(bodyParser.json())

app.use('/user', signupRoutes);
app.use('/expense', expenseRoutes)

Users.hasMany(Expense)
Expense.belongsTo(Users)


sequelize.sync({force: false})
.then((result) => {
    
    app.listen(5000)
    
}).catch(err => {
    console.log(err)
})
