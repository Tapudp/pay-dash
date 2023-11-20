const BalanceService = require('../services/balanceService');

async function depositBalance(req, res, next) {
  try {
    const { userId } = req.params;
    const { amount } = req.body;
    const models = req.app.get('models');

    const result = await BalanceService.deposit(userId, amount, models);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  depositBalance,
};
