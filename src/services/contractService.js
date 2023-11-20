const { createError } = require('../utils/errorHandler');

async function getContractById(contractId, models) {
  try {
    const { Contract } = models;
    const contract = await Contract.findOne({ where: { id: contractId } });

    if (!contract) {
      throw createError('Contract not found!', 404);
    }

    return contract;
  } catch (error) {
    throw createError(error.message, 500, error.stack);
  }
}

module.exports = {
  getContractById,
};
