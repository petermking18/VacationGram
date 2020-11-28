"use strict";

require("dotenv").config();

var mysql = require("mysql");

var _require = require("@rama41222/node-logger"),
    log = _require.log,
    ExpressAPILogMiddleware = _require.ExpressAPILogMiddleware;

var connection = mysql.createConnection({
  host: process.env.MYSQL_CLOUD_HOST,
  user: process.env.MYSQL_CLOUD_USER,
  password: process.env.MYSQL_CLOUD_PASS,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DB
});
var logger = log({
  console: true,
  file: false,
  label: "VacationGram-express"
});
connection.connect(function (err) {
  if (err) logger.error("Cannot connect host: " + process.env.MYSQL_DB);else logger.info("Connected to the DB! ");
});

exports.propertyCheck = function (req, res, propertyNameList) {
  var success = true;
  propertyNameList.every(function (name) {
    if (!(name in req.body)) {
      res.status(400).json({
        response: "Missing required field: `" + name + "`"
      });
      success = false;
      return false;
    }

    return true;
  });
  return success;
};

exports.respondSqlError = function (sqlErr, res) {
  res.status(400).send({
    code: sqlErr.code,
    response: sqlErr.sqlMessage,
    query: sqlErr.sql
  });
};

exports.connection = connection;