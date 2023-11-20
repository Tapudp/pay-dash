const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');

router.get('/:id', contractController.getContractById);

module.exports = router;
