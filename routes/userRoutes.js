const express = require('express')


const userC = require('../controllers/userControllers');

const router = express.Router();

router.post('/user-data', userC.postUserInfo);

router.post('/login-data',userC.postLoginInfo)

module.exports = router
