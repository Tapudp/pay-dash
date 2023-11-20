const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { errorHandler } = require('./utils/errorHandler');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contractRoutes = require('./routes/contractRoutes');
const logger = require('./utils/logger');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
// Enable CORS for all routes
app.use(cors());

app.get('/', async (req, res, next) => {
  try {
    logger.warn(':: server responds hi :: ');
    res.status(200).send({ status: 'success', message: 'Server responds hi' });
  } catch (error) {
    next(error);
  }
});

/**
 * FIX ME!
 * @returns contract by id
 * shifted to it's appropriate route and controller as mentioned below
 */
// app.get('/contracts/:id', getProfile, async (req, res) => {
//   const { Contract } = req.app.get('models');
//   const { id } = req.params;
//   const contract = await Contract.findOne({ where: { id } });
//   if (!contract) return res.status(404).end();
//   res.json(contract);
// });

// Contract routes
app.use('/contracts', getProfile, contractRoutes);

// Profile routes
app.use('/profiles', profileRoutes);

// Job routes
app.use('/jobs', getProfile, jobRoutes);

// Balance routes
app.use('/balances', getProfile, balanceRoutes);

// admin routes
app.use('/admin', getProfile, adminRoutes);

// Error handling middleware
app.use(errorHandler);
module.exports = app;
