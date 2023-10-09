const express = require('express')

const userC = require('../controllers/userControllers');

const router = express.Router();

router.post('/user-data', userC);

module.exports = router
