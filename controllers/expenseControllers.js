const Expense = require('../models/expenseModels')


module.exports.getExpenseData = async (req, res, next) => {
    try{
        
            const all_data = await Expense.findAll()
            res.status(200).json({totalXpense: all_data})
            }
            catch(err) {
                console.log(err)
            }
}


module.exports.postExpenseData = async(req, res, next) => {
   try{
    console.log(req.body)
    console.log('line no 19')
    const data = await Expense.create(req.body)
    res.status(201).json({newDetails: data})
    }
    catch(err) {
        console.log(err)
    }
}

module.exports.deleteData = async(req, res, next) => {
    
    try{
    if(req.params.id === 'undefined'){
        console.log('ID is missing')
        res.status(400).json({err: 'No ID FOUND'})
    }

    const xpensId = req.params.id;
    console.log(xpensId)
    console.log('line 35')
    await Expense.destroy({where: {id: xpensId}})
    res.sendStatus(200)
}
catch(err) {
    console.log(err)
}
}


    
