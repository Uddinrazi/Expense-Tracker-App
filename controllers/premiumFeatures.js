const Expense = require("../models/expenseM");
const User = require("../models/userM");
const sequelize = require("../util/db");


module.exports.getLeaderBorad = async(req, res, next) => {
    try{
     const leaderBoard = await User.findAll({
        order: [['total_cost','DESC']]
     })
      
    //console.log(leaderBoard, 'line 20 aggg')
    res.status(200).json(leaderBoard)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}
