const app = require('./app.js');
const { Logger } = require('../logger.js');

app.listen(3000, () => {
  Logger.consoleLog(`Listening on port ${3000}`);
})

module.exports = app;