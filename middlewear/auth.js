const jwt = require("jsonwebtoken");
const Users = require("../models/userM");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token, "hey m token");

    const user = jwt.verify(token, "jdfkjskjfndi83eeu873g28uew");
    console.log(user);
    Users.findByPk(user.userId)
      .then((user) => {
        req.user = user.id,
        
        console.log(req.user.total_cost, 'm user in line 12')
        //console.log(user,' in line 15')
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticate;
