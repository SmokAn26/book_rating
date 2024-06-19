const pgPromise = require("pg-promise");

const config = {
  host: "172.20.7.6",
  user: "st",
  password: "pwd",
  database: "1991_05_PM11",
};

const pgp = pgPromise();
const db = pgp(config);

module.exports = db;
