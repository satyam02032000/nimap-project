const { Client } = require('pg');
var config = require('./config');
var migrate = require('./migrate');

var client = "";

(async () => {
  if (!client) {
    client = new Client(config);
    await client.connect();
    await migrate(config.database);
    console.log("Database connected & migration completed");
  }
})();

module.exports = {
  client,
};
