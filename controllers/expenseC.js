const Expense = require("../models/expenseM");
const User = require("../models/userM");
const sequelize = require('../util/db')
const File = require("../models/files");



module.exports.getExpenseData = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    console.log(req.body.userId, 'line 54 hhhhhhhhh')
    const Items_per_page = +req.query.limit || 4;
    const page = +req.query.page || 1

    let totalItems;
    
    let total = await Expense.count()
    totalItems = total;
    
    return Expense.findAll({
      where: {userId: req.body.userId},
      offset: (page-1) * Items_per_page,
      limit : Items_per_page
    }).then((expenses) => {
      
     
      res.json({
        expense: expenses,
        currentPage: page,
        hasNextPage: Items_per_page * page < totalItems,
        //nextPage: page + 1,
        hasPreviousPage : page > 1,
        //previousPage: page - 1,
        lastPage: Math.ceil(totalItems/Items_per_page),
        
      })
    })
    .catch((err) => {
      throw new Error(err)
    })

   
  } catch (err) {
    console.log(err);
  }
};

module.exports.postExpenseData = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    
    req.body.userId = req.user.id
    const {amount, description, category} = req.body
    
    const data = await Expense.create(req.body,{transaction: t})    
    const totalXpense = Number(req.user.total_cost) + Number(amount)
    console.log( req.user.total_cost, 'line 26 dddddddddd')
    await User.update({
      total_cost: totalXpense
    },{
      where: {id: req.user.id},
      transaction:t
    })
  
    await t.commit()
    res.status(201).json({ newDetails: data })
  }catch (err) { 
    await t.rollback()
    console.log(err)}
   
};

module.exports.deleteData = async (req, res, next) => {
  try {
    if (req.params.expenseid === "undefined") {
      console.log("ID is missing");
      res.status(400).json({ err: "No ID FOUND" });
    }
    req.body.userId = req.user;
    const {expenseid} = req.params;
    
    const expenseData = await Expense.findByPk(expenseid)
    
    let noOfrows = await Expense.destroy({ where: { id: expenseid } });
    if (noOfrows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "not user expense" });
    }
    console.log(noOfrows, 'line 62')
    
    const userdata = await User.findByPk(req.user.id)
    
    const total =Number(userdata.dataValues.total_cost) - Number(expenseData.dataValues.amount) 
    await User.update({
      total_cost: total
    },{
      where: {id: req.user.id},
      //transaction:t
    })
    return res.status(200).json({ message: "data got deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete" });
  }
};
