const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/best-profession', adminController.getBestProfession);
router.get('/best-clients', adminController.getBestClients);

module.exports = router;
