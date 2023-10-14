const express = require('express')

const expenseC = require('../controllers/expenseC');
const userAuthenticate = require('../middlewear/auth')

const router = express.Router();

router.get('/expense-data',userAuthenticate,expenseC.getExpenseData);

router.post('/add-expense/', userAuthenticate, expenseC.postExpenseData)

router.delete('/delete-expense/:expenseid',userAuthenticate,  expenseC.deleteData)

module.exports = router;