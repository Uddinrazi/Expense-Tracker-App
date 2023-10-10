const express = require('express')

const expenseC = require('../controllers/expenseControllers');

const router = express.Router();

router.get('/expense-data', expenseC.getExpenseData);

router.post('/add-expense', expenseC.postExpenseData)

router.delete('/delete-expense/:id', expenseC.deleteData)

module.exports = router;