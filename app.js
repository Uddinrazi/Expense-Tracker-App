const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require('morgan');
const fs = require('fs')
require("dotenv").config();
const sequelize = require("./util/db");
const path = require("path");
const app = express();




app.use(express.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

const signupRoutes = require("./routes/userR");
const expenseRoutes = require("./routes/expenseR");
const purchaseRoutes = require("./routes/purchase");
const featuresRoutes = require("./routes/premiumFeatures");
const forgotP = require("./routes/forgotP");
const downloadRoutes = require("./routes/download");



const User = require("./models/userM");
const Expense = require("./models/expenseM");
const Order = require("./models/order");
const ForgotPassword = require('./models/forgotP')
const File = require('./models/files')

//require("dotenv").config();

app.use(express.static(path.join(__dirname, "/public")));

app.use(cors());
app.use(bodyParser.json());

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  }
  next();
}
app.use(ignoreFavicon);


app.use("/user", signupRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use('/features', featuresRoutes)
app.use('/password', forgotP)
app.use('/dwnload', downloadRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(File);
File.belongsTo(User)

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
