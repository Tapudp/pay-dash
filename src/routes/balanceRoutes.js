const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

router.post('/deposit/:userId', balanceController.depositBalance);

module.exports = router;
