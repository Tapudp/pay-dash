const { Op } = require('sequelize');
const { createError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

async function getUnpaidJobs(clientId, contractorId, models) {
  try {
    if (!clientId || !contractorId) {
      throw createError('Client-id or Contractor-id is missing in the request', 400);
    }
    const { Job, Contract, Profile } = models;
    const unpaidJobs = await Job.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          as: 'Contract',
          attributes: ['ContractorId', 'ClientId'],
          where: {
            status: 'in_progress',
            [Op.and]: [{ ContractorId: contractorId }, { ClientId: clientId }],
          },
          include: [
            {
              model: Profile,
              attributes: ['id', 'firstName', 'lastName'],
              as: 'Contractor',
              where: {
                id: contractorId,
              },
            },
          ],
        },
      ],
      logging: (sql) => logger.warn(sql),
    });

    return unpaidJobs;
  } catch (error) {
    throw createError(error.message, 500, error.stack);
  }
}

async function getPaidJobs(clientId, contractorId, models) {
  try {
    if (!clientId || !contractorId) {
      throw createError('Client-id or Contractor-id is missing in the request', 400);
    }
    const { Job, Contract, Profile } = models;
    const paidJobs = await Job.findAll({
      where: {
        paid: true,
      },
      include: [
        {
          model: Contract,
          as: 'Contract',
          attributes: ['ContractorId', 'ClientId'],
          where: {
            status: 'in_progress',
            [Op.and]: [{ ContractorId: contractorId }, { ClientId: clientId }],
          },
          include: [
            {
              model: Profile,
              attributes: ['id', 'firstName', 'lastName'],
              as: 'Contractor',
              where: {
                id: contractorId,
              },
            },
          ],
        },
      ],
    });

    return paidJobs;
  } catch (error) {
    throw createError(error.message, 500, error.stack);
  }
}

async function getAllJobs(clientId, contractorId, models) {
  try {
    const unpaidJobs = await getUnpaidJobs(clientId, contractorId, models);
    const paidJobs = await getPaidJobs(clientId, contractorId, models);
    return {
      unpaidJobs,
      paidJobs,
    };
  } catch (error) {
    throw error;
  }
}

const pay = async (clientId, jobId, models, sequelize) => {
  try {
    const { Job, Profile, Contract } = models;

    const result = await sequelize.transaction(async (transaction) => {
      const [job] = await sequelize.query(
        `
        SELECT
          "J".*,
          "C1"."ContractorId" AS "ContractorId",
          "P1"."balance" AS "ContractorBalance",
          "C2"."ClientId" AS "ClientId",
          "P2"."balance" AS "ClientBalance"
        FROM
          "Jobs" AS J
        INNER JOIN
          "Contracts" AS "C1" ON J."ContractId" = "C1"."id"
        INNER JOIN
          "Profiles" AS "P1" ON "C1"."ContractorId" = "P1"."id"
        INNER JOIN
          "Contracts" AS "C2" ON "J"."ContractId" = "C2"."id"
        INNER JOIN
          "Profiles" "P2" ON "C2"."ClientId" = "P2"."id"
        WHERE
          "J"."id" = :jobId
          AND "P2"."id" = :clientId
        `,
        {
          replacements: { jobId: parseInt(jobId, 10), clientId: parseInt(clientId, 10) },
          type: sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      if (!job) {
        throw createError('Job not found!', 404);
      }

      if (job.paid) {
        throw createError('Job has already been paid for', 400);
      }

      // Check if the client has sufficient balance
      if (job.price > job.ClientBalance) {
        throw createError('Insufficient balance to pay for the job', 400);
      }

      // Update the job as paid
      await sequelize.query(
        `
        UPDATE "Jobs"
        SET "paid" = true, "paymentDate" = CURRENT_TIMESTAMP
        WHERE "id" = :jobId
        `,
        {
          replacements: { jobId },
          type: sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );

      // Deduct the amount from the client's balance and round off to 2 decimals
      await sequelize.query(
        `
  UPDATE "Profiles"
  SET "balance" = ROUND("balance" - :price, 2)
  WHERE "id" = :clientId
  `,
        {
          replacements: { clientId, price: job.price },
          type: sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );

      // Add the amount to the contractor's balance
      await sequelize.query(
        `
        UPDATE "Profiles"
        SET "balance" = "balance" + :price
        WHERE "id" = :contractorId
        `,
        {
          replacements: { contractorId: job.ContractorId, price: job.price },
          type: sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );

      return { status: 'success', message: 'Job paid successfully' };
    });

    return result;
  } catch (error) {
    throw createError(error.message, 500, error.stack);
  }
};

module.exports = {
  pay,
  getUnpaidJobs,
  getPaidJobs,
  getAllJobs,
};
