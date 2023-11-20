const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/', profileController.getAllProfiles);
router.get('/clients', profileController.getAllClients);
router.get('/contractors', profileController.getContractorsForClient);
module.exports = router;
