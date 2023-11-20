const constants = require('../constants');

// this can be used to push the logs to server/database
function logWithColour(colour, message) {
  const timeStamp = new Date().toString();
  console.log(
    `${constants.colors.cyanColor} :: [${timeStamp}] :: ${colour} ${message}${constants.colors.resetColor}`
  );
}

module.exports = {
  info: function (...messageArgs) {
    logWithColour(constants.colors.greenColor, messageArgs);
  },
  warn: function (...messageArgs) {
    logWithColour(constants.colors.yellowColor, messageArgs);
  },
  error: function (...messageArgs) {
    logWithColour(constants.colors.redColor, messageArgs);
  },
};
