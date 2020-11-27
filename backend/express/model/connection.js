"use strict";
require("dotenv").config();
var mysql = require("mysql");
const
{
  log,
  ExpressAPILogMiddleware
} = require("@rama41222/node-logger");

var connection = mysql.createConnection(
{
  host: process.env.MYSQL_CLOUD_HOST,
  user: process.env.MYSQL_CLOUD_USER,
  password: process.env.MYSQL_CLOUD_PASS,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DB,
  typeCast: function castField(field, useDefaultTypeCasting)
  {

    // We only want to cast bit fields that have a single-bit in them. If the field
    // has more than one bit, then we cannot assume it is supposed to be a Boolean.
    if ((field.type === "BIT") && (field.length === 1))
    {

      var bytes = field.buffer();

      // A Buffer in Node represents a collection of 8-bit unsigned integers.
      // Therefore, our single "bit field" comes back as the bits '0000 0001',
      // which is equivalent to the number 1.
      return (bytes[0] === 1);

    }

    return (useDefaultTypeCasting());

  },
});

const logger = log(
{
  console: true,
  file: false,
  label: "VacationGram-express",
});

connection.connect(function(err)
{
  if (err) logger.error("Cannot connect host: " + process.env.MYSQL_DB);
  else logger.info("Connected to the DB! ");
});

exports.propertyCheck = function(req, res, propertyNameList)
{
  var success = true;

  propertyNameList.every(function(name)
  {
    if (!(name in req.body))
    {
      res.status(400).json(
      {
        response: "Missing required field: `" + name + "`",
      });

      success = false;
      return false;
    }
    return true;
  });

  return success;
};

exports.respondSqlError = function(sqlErr, res)
{
  res.status(400).send(
  {
    success: false,
    response: sqlErr.sqlMessage,
    info: sqlErr,
  });
};

exports.connection = connection;