const { Op } = require('sequelize');
const logger = require('../utils/logger');

async function getBestProfession(start, end, models, sequelize) {
  try {
    const query = `
    SELECT
      "Contractor"."profession" AS "profession",
      SUM("price") AS "totalEarnings"
    FROM
      "Jobs" AS "Job"
      LEFT OUTER JOIN "Contracts" AS "Contract" ON "Job"."ContractId" = "Contract"."id"
      LEFT OUTER JOIN "Profiles" AS "Contractor" ON "Contract"."ContractorId" = "Contractor"."id"
    WHERE
      "Job"."paymentDate" BETWEEN :start AND :end
    GROUP BY
      "Contractor"."profession"
    ORDER BY
      "totalEarnings" DESC
    LIMIT 1;
    `;
    const results = await sequelize.query(query, {
      replacements: { start, end },
      type: sequelize.QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    throw error;
  }
}

async function getBestClients(start, end, limit, models, sequelize) {
  try {
    const query = `
    SELECT
      "Client"."id",
      "Client"."firstName" || ' ' || "Client"."lastName" AS "fullName",
      SUM("Job"."price") AS "paid"
    FROM
      "Jobs" AS "Job"
      LEFT OUTER JOIN "Contracts" AS "Contract" ON "Job"."ContractId" = "Contract"."id"
      LEFT OUTER JOIN "Profiles" AS "Contractor" ON "Contract"."ContractorId" = "Contractor"."id"
      LEFT OUTER JOIN "Profiles" AS "Client" ON "Contract"."ClientId" = "Client"."id"
    WHERE
      "Job"."paymentDate" BETWEEN :start AND :end
    GROUP BY
      "Client"."id", "fullName"
    ORDER BY
      "paid" DESC
    LIMIT :limit;
  `;

    const results = await sequelize.query(query, {
      replacements: { start, end, limit: parseInt(limit) },
      type: sequelize.QueryTypes.SELECT,
    });

    return results;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getBestProfession,
  getBestClients,
};
