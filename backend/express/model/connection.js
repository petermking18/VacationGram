"use strict";
require("dotenv").config();
var mysql = require("mysql");
const { log, ExpressAPILogMiddleware } = require("@rama41222/node-logger");

var connection = mysql.createConnection({
  host: process.env.MYSQL_CLOUD_HOST,
  user: process.env.MYSQL_CLOUD_USER,
  password: process.env.MYSQL_CLOUD_PASS,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DB,
});

const logger = log({
  console: true,
  file: false,
  label: "VacationGram-express",
});

connection.connect(function (err) {
  if (err) logger.error("Cannot connect host: " + process.env.MYSQL_DB);
  else logger.info("Connected to the DB! ");
});

module.exports = connection;
