const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/unpaid', jobController.getUnpaidJobs);
router.get('/paid', jobController.getPaidJobs);
router.get('/all', jobController.getAllJobs);
router.post('/:job_id/pay', jobController.payJob);

module.exports = router;
