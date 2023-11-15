const express = require('express')

const downloadFile = require('../controllers/download');
const userAuthenticate = require('../middlewear/auth')

const router = express.Router()

router.get('/download-expense', userAuthenticate,downloadFile.downloadExpense)


module.exports = router;