const jwt = require("jsonwebtoken");
const User = require("../models/userM");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token, "hey m token");

    const users = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(users,'line 12 in auth')
   let user = await User.findByPk(users.userId)
    
      
        req.user = user,
        
        next();
      
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticate;
