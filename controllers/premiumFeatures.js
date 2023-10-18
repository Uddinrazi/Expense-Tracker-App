const Expense = require("../models/expenseM");
const User = require("../models/userM");


module.exports.getLeaderBorad = async(req, res, next) => {
    try{
     const users = await User.findAll({
        attributes: ['id', 'name']
     })
     const expenses = await Expense.findAll({
        attributes: ['userId', 'amount']
     })
    const userAggregatedExpenses = []

    
    expenses.map((expense) => {
        if(userAggregatedExpenses[expense.id]){
        userAggregatedExpenses[expense.id] = userAggregatedExpenses[expense.id] + expense.amount
        console.log(userAggregatedExpenses[expense.id],'line 15 idddd')
        console.log(expense.amount, ' line 16 ammmm')
        console.log(expense, 'line 17 exxxx')
        console.log(expenses,'line 18 eeee')
    ;
}else{
        userAggregatedExpenses[expense.id] = expense.amount;
    }
})  
    console.log(userAggregatedExpenses, 'line 20 aggg')
    return res.status(200).json(userAggregatedExpenses)
    }
    catch(err){
        console.log(err)
    }
}
