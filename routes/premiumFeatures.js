const express = require('express')

const premiumC = require('../controllers/premiumFeatures');
const userAuthenticate = require('../middlewear/auth')

const router = express.Router();

router.get('/show-premium-features', userAuthenticate,premiumC.getLeaderBorad)

module.exports = router;