"use strict";
var sql = require("./connection.js");

var SavedTrip = function(savedTrip)
{
  this.trip_id = savedTrip.trip_id;
  this.saved_by_user_id = savedTrip.saved_by_user_id;
};

exports.get_saved_trips = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `user_saved_trip` WHERE saved_by_user_id = ? GROUP BY `trip_id`;",
    req.params.id,
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        // construct array of ids
        var idArray = [];
        for (var i = 0; i < sqlRes.length; i++)
        {
          idArray.push(sqlRes[i].trip_id);
        }

        sql.connection.query(
          "SELECT * FROM `trip` WHERE `id` IN (?);",
          [idArray],
          function(subErr, subRes)
          {
            if (sql.isSuccessfulQuery(subErr, res))
            {
              res.status(200).send(
              {
                success: true,
                count: Object.keys(subRes).length,
                info: subRes,
              });
            }
          }
        );
      }
    }
  );
};

exports.did_save_trip = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `user_saved_trip` WHERE saved_by_user_id = ? AND trip_id = ?;",
    [req.params.id, req.params.tripId],
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        res.status(200).send(
        {
          success: true,
          did_save: sqlRes.length > 0,
        });
      }
    }
  );
};

exports.save_trip = function(req, res)
{
  if (sql.propertyCheck(req, res, ["trip_id"]))
  {
    var newSavedTrip = new SavedTrip(req.body);
    newSavedTrip.saved_by_user_id = req.params.id;

    sql.connection.query(
      "INSERT INTO `user_saved_trip` SET ?;",
      newSavedTrip,
      function(sqlErr, sqlRes)
      {
        if (sql.isSuccessfulQuery(sqlErr, res))
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully saved trip",
          });
        }
      }
    );
  }
};

exports.delete_saved_trip = function(req, res)
{
  sql.connection.query(
    "DELETE FROM `user_saved_trip` WHERE `trip_id` = ? AND `saved_by_user_id` = ?;",
    [req.params.tripId, req.params.id],
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        if (sqlRes.affectedRows == 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "No user with id " + req.params.id + " & trip with id " + req.parmas.tripId + "found, nothing deleted",
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully deleted saved trip",
            info: sqlRes,
          });
        }
      }
    }
  );
};