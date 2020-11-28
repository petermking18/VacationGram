"use strict";
var sql = require("./connection.js");

exports.get_reaction_name = function(req, res)
{
  sql.connection.query(
    "SELECT * from `lkp_reaction` WHERE `id` = ?;",
    req.params.id,
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        if (sqlRes.length <= 0)
        {
          res.status(200).send(
          {
            success: false,
            name: "",
            response: "Reaction name with id " + req.params.id + " was not found",
          })
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            name: sqlRes[0].name,
          });
        }
      }
    }
  );
};