const jwt = require("jsonwebtoken");
const User = require("../models/userM");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token, "hey m token");

    const user = jwt.verify(token, "jdfkjskjfndi83eeu873g28uew");
    console.log(user,'line no 10');
    User.findByPk(user.userId)
      .then((user) => {
        req.user = user,
        
        console.log(user.id, 'm user in line 15 jjjjjjj')
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
