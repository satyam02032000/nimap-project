var { createDb, migrate } = require('postgres-migrations');
var config = require('./config');

module.exports = async (databaseName) => {
  await createDb(databaseName, config);
  await migrate(config, "database/migrations");
};
