const Expense = require('../models/expenseModels')


module.exports.getExpenseData = async (req, res, next) => {
    try{    
            const userId = req.user.id;
            const all_data = await Expense.findAll({where: {userId: req.user.id}})
            if(userId == null)
            console.log('user is null hense no user found')
            else
           console.log('error is not there')
            console.log(userId,' line 7 in ec with id')
            res.status(200).json({totalXpense: all_data})
           

            }
            catch(err) {
                console.log(err)
            }
}


module.exports.postExpenseData = async(req, res, next) => {
   try{
    userId = req.body.id;
    console.log(userId,'m user id in ec post')
    
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


    
