const jwt = require("jsonwebtoken");
const User = require("../models/userM");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token, "hey m token");

    const users = jwt.verify(token, "jdfkjskjfndi83eeu873g28uew");
   
   let user = await User.findByPk(users.userId)
    console.log(users,'line 12 in auth')
      
        req.user = user,
        
        next();
      
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticate;
