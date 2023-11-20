const { createError } = require('../utils/errorHandler');

const getProfile = async (req, res, next) => {
  const profileId = req.get('profile_id');

  if (!profileId) {
    return next(createError('Please include the profile_id in the request header', 400));
  }

  const { Profile } = req.app.get('models');
  const profile = await Profile.findOne({ where: { id: profileId || 0 } });

  if (!profile)
    return res
      .status(401)
      .send({
        status: 'failure',
        message: 'User with the profile_id not available',
      })
      .end();
  req.profile = profile;
  next();
};
module.exports = { getProfile };
