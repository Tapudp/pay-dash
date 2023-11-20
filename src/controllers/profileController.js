const { getProfile } = require('../middleware/getProfile');
const ProfilesService = require('../services/profileService');

async function getAllProfiles(req, res, next) {
  try {
    const models = req.app.get('models');
    const profiles = await ProfilesService.getAll(models);
    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
}

async function getAllClients(req, res, next) {
  try {
    const models = req.app.get('models');
    const profiles = await ProfilesService.getAllClients(models);
    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
}
async function getContractorsForClient(req, res, next) {
  try {
    const models = req.app.get('models');
    const clientProfile = req.profile;
    const profiles = await ProfilesService.getContractorsForClient(clientProfile, models);
    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProfiles,
  getAllClients,
  getContractorsForClient: [getProfile, getContractorsForClient],
};
