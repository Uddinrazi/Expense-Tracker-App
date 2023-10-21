const Expense = require("../models/expenseM");
const User = require("../models/userM");


module.exports.getExpenseData = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    
    const all_data = await Expense.findAll({
      where: { userId: req.user.id },
    });
    //console.log(req.body.userId, 'm user id  line 9')

    res.status(200).json({ totalXpense: all_data });
  } catch (err) {
    console.log(err);
  }
};

module.exports.postExpenseData = async (req, res, next) => {
  try {
    req.body.userId = req.user.id
    const {amount, description, category} = req.body
    
    const data = await Expense.create(req.body)    
     const totalXpense = Number(req.user.total_cost) + Number(amount)
    console.log( req.user.total_cost, 'line 26 dddddddddd')
    await User.update({
      total_cost: totalXpense
    },{
      where: {id: req.user.id}
    })
  
    
    res.status(201).json({ newDetails: data })
  }catch (err) { console.log(err)}
   
};

module.exports.deleteData = async (req, res, next) => {
  try {
    if (req.params.expenseid === "undefined") {
      console.log("ID is missing");
      res.status(400).json({ err: "No ID FOUND" });
    }
    req.body.userId = req.user;
    const xpensId = req.params;
    console.log(xpensId, " m expense id line 42");

    let noOfrows = await Expense.destroy({ where: { id: xpensId.expenseid } });
    if (noOfrows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "not user expense" });
    }
    //console.log(data, 'm data here ')
    return res.status(200).json({ message: "data got deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete" });
  }
};
