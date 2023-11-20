const JobService = require('../services/jobService');
const { createError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

async function getUnpaidJobs(req, res, next) {
  try {
    const models = req.app.get('models');
    const { contractorId } = req.query;
    const clientId = req.profile.id;
    const unpaidJobs = await JobService.getUnpaidJobs(clientId, contractorId, models);
    res.status(200).json(unpaidJobs);
  } catch (error) {
    next(error);
  }
}

async function getPaidJobs(req, res, next) {
  try {
    const models = req.app.get('models');
    const { contractorId } = req.query;
    const clientId = req.profile.id;
    const unpaidJobs = await JobService.getPaidJobs(clientId, contractorId, models);
    res.status(200).json(unpaidJobs);
  } catch (error) {
    next(error);
  }
}

async function getAllJobs(req, res, next) {
  try {
    const models = req.app.get('models');
    const { contractorId } = req.query;
    const clientId = req.profile.id;
    const unpaidJobs = await JobService.getAllJobs(clientId, contractorId, models);
    res.status(200).json(unpaidJobs);
  } catch (error) {
    next(error);
  }
}

async function payJob(req, res, next) {
  try {
    const { job_id } = req.params;
    const models = req.app.get('models');
    const sequelize = req.app.get('sequelize');
    const clientId = req.profile.id;

    const result = await JobService.pay(clientId, job_id, models, sequelize);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUnpaidJobs,
  getPaidJobs,
  getAllJobs,
  payJob,
};
