const express = require('express')

const expenseC = require('../controllers/expenseControllers');
const userAuthenticate = require('../middlewear/auth')

const router = express.Router();

router.get('/expense-data',userAuthenticate,expenseC.getExpenseData);

router.post('/add-expense/:userId', expenseC.postExpenseData)

router.delete('/delete-expense/:id', expenseC.deleteData)

module.exports = router;