const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/db");
const path = require("path");
const app = express();

app.use(express.json());
const signupRoutes = require("./routes/userR");
const expenseRoutes = require("./routes/expenseR");
const purchaseRoutes = require("./routes/purchase");
const featuresRoutes = require("./routes/premiumFeatures");

const Users = require("./models/userM");
const Expense = require("./models/expenseM");
const Order = require("./models/order");

require("dotenv").config();

app.use(express.static(path.join(__dirname, "/public")));

app.use(cors());
app.use(bodyParser.json());

app.use("/user", signupRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use('/features', featuresRoutes)

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
