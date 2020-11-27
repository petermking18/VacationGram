"use strict";
var sql = require("./connection");

var Trip = function(trip)
{
  this.body = trip.body;
  this.date_created = trip.date_created;
  this.date_last_updated = trip.date_last_updated;
  this.destination = trip.destination;
  this.id = trip.id;
  this.is_public = trip.is_public;
  this.origin = trip.origin;
  this.price = trip.price;
  this.rating = trip.rating;
  this.sentiment_id = trip.sentiment_id;
  this.title = trip.title;
  this.user_id = trip.user_id;
};

exports.create_trip = function(req, res)
{
  if (
    sql.propertyCheck(req, res, [
      "body",
      "destination",
      "rating",
      "title",
      "user_id",
      "is_public",
    ])
  )
  {
    var newTrip = new Trip(req.body);
    newTrip.date_created = new Date();
    newTrip.date_last_updated = new Date();

    sql.connection.query(
      "INSERT INTO `trip` SET ?;",
      newTrip,

      function(sqlErr, sqlRes)
      {
        if (sqlErr)
        {
          sql.respondSqlError(sqlErr, res);
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully created trip",
            info: sqlRes.insertId,
          })
        }
      }
    );
  }
};

exports.get_trips = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `trip`;",
    null,
    function(sqlErr, sqlRes)
    {
      if (sqlErr)
      {
        sql.respondSqlError(sqlErr, res);
      }
      else
      {
        res.status(200).send(
        {
          success: true,
          info: sqlRes,
        });
      }
    }
  );
};

exports.get_likes = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `like_on_trip` WHERE trip_id = ?;",
    req.params.id,
    function(sqlErr, sqlRes)
    {
      if (sqlErr)
      {
        sql.respondSqlError(sqlErr, res);
      }
      else
      {
        res.status(200).send(
        {
          success: true,
          info: sqlRes,
        });
      }
    }
  );
};

exports.did_user_like = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `like_on_trip` WHERE trip_id = ? AND liked_by_user = ?;",
    [req.params.id, req.params.userId],
    function(sqlErr, sqlRes)
    {
      if (sqlErr)
      {
        sql.respondSqlError(sqlErr, res);
      }
      else
      {
        res.status(200).send(
        {
          success: true,
          did_like: sqlRes.length > 0,
        });
      }
    }
  );
};