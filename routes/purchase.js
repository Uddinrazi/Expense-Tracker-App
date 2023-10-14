const express = require('express')

const purchaseC = require('../controllers/purchase');
const userAuthenticate = require('../middlewear/auth')

const router = express.Router()

// http://localhost:5000/purchase/premium-membership

router.get('/premium-membership',userAuthenticate,purchaseC.purchase_premium)

router.post('/update-transaction-status', userAuthenticate,purchaseC.updateTransactionStatus);

module.exports = router;