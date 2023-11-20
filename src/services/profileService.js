const { createError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

async function getAll(models) {
  try {
    const { Profile } = models;
    const profiles = await Profile.findAll();
    return profiles;
  } catch (error) {
    throw error;
  }
}

async function getAllClients(models) {
  try {
    const { Profile } = models;
    const profiles = await Profile.findAll({
      where: {
        type: 'client',
      },
    });
    return profiles;
  } catch (error) {
    throw error;
  }
}

async function getContractorsForClient(clientProfile, models) {
  try {
    if (clientProfile.type !== 'client') {
      throw createError(
        'Access restricted: Only clients can view contractors associated with their contracts',
        400
      );
    }
    const { Profile, Contract } = models;
    const profiles = await Profile.findAll({
      where: {
        type: 'contractor',
      },
      include: [
        {
          model: Contract,
          as: 'Contractor',
          where: {
            ClientId: clientProfile.id,
          },
        },
      ],
    });
    return profiles;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll,
  getAllClients,
  getContractorsForClient,
};
