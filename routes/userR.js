const express = require('express')


const userC = require('../controllers/userC');

const router = express.Router();

router.post('/user-data', userC.postUserInfo);

router.post('/login-data',userC.postLoginInfo)

module.exports = router
