const { createError } = require('../utils/errorHandler');

async function deposit(userId, amount, models) {
  try {
    const { Profile, Job, Contract } = models;
    const user = await Profile.findByPk(userId);

    if (!user) {
      throw createError('User not found!', 404);
    }

    // not allowed for the contractor-type users
    if (user.type !== 'client') {
      throw createError('Only clients can make deposits', 400);
    }

    // Calculate the total amount the client owes for their jobs
    const totalOwed = await Job.sum('price', {
      include: [
        {
          model: Contract,
          where: { ClientId: userId },
        },
      ],
    });

    // calulate the maximum allowed deposit (25% of the user's balance)
    const maxDeposit = totalOwed * 0.25;

    if (amount > maxDeposit) {
      throw createError('Deposit amount exceeds the maximum allowed limit', 400);
    }

    // Update the user's balance
    user.balance = (parseFloat(user.balance) + parseFloat(amount)).toFixed(2);
    await user.save();

    return { status: 'success', message: `Balance amount $${amount}  deposited successfully` };
  } catch (error) {
    throw createError(error.message, 500, error.stack);
  }
}

module.exports = {
  deposit,
};
