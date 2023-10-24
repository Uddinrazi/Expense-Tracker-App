const express = require('express')

const forgotP = require('../controllers/forgotP');


const router = express.Router();

router.get('/update-password/:resetpasswordid', forgotP.updatePassword)

router.get('/reset-password/:id', forgotP.resetPassword)

router.use('/forgot-password', forgotP.forgotPassword)

module.exports = router;