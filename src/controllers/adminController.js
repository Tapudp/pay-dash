const AdminService = require('../services/adminService');

async function getBestProfession(req, res, next) {
  try {
    const { start, end } = req.query;
    const sequelize = req.app.get('sequelize');
    const models = req.app.get('models');

    const bestProfession = await AdminService.getBestProfession(start, end, models, sequelize);
    res.status(200).json({ bestProfession });
  } catch (error) {
    next(error);
  }
}

async function getBestClients(req, res, next) {
  try {
    const { start, end, limit } = req.query;
    const models = req.app.get('models');
    const sequelize = req.app.get('sequelize');

    const bestClients = await AdminService.getBestClients(start, end, limit, models, sequelize);
    res.status(200).json(bestClients);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBestProfession,
  getBestClients,
};
