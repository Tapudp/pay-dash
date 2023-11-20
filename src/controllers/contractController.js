const ContractService = require('../services/contractService');

async function getContractById(req, res, next) {
  try {
    const { id } = req.params;
    const models = req.app.get('models');
    const contract = await ContractService.getContractById(id, models);
    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContractById,
};
