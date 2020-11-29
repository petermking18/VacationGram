"use strict";
var sql = require("./connection");

var Trip = function(trip)
{
  this.body = trip.body;
  this.date_created = trip.date_created;
  this.date_last_updated = trip.date_last_updated;
  this.destination = trip.destination;
  this.id = trip.id;
  this.origin = trip.origin;
  this.price = trip.price;
  this.rating = trip.rating;
  this.reaction_id = trip.reaction_id;
  this.title = trip.title;
  this.user_id = trip.user_id;
  this.image_url = trip.image_url;
  this.is_public = trip.is_public !== 0 && trip.is_public !== 1 ? 0 : trip.is_public;
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
        if (sql.isSuccessfulQuery(sqlErr, res))
        {
          sql.connection.query(
            "SELECT * FROM `trip` WHERE `id` = ?;",
            sqlRes.insertId,
            function(subErr, subRes)
            {
              if (sql.isSuccessfulQuery(subErr, res))
              {
                res.status(200).send(
                {
                  success: true,
                  response: "Successfully created trip",
                  info: subRes,
                });
              }
            }
          );
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
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        res.status(200).send(
        {
          success: true,
          count: Object.keys(sqlRes).length,
          info: sqlRes,
        });
      }
    }
  );
};

exports.get_trip = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `trip` WHERE `id` = ?;",
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
            response: "Couldn't find trip " + req.params.id,
          });
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
    }
  );
};

exports.delete_trip = function(req, res)
{
  sql.connection.query(
    "DELETE FROM `trip` WHERE `id` = ?;",
    req.params.id,
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        if (sqlRes.affectedRows == 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "Could not find trip " + req.params.id,
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully deleted trip",
          });
        }
      }
    }
  );
}

exports.get_likes = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `like_on_trip` WHERE trip_id = ?;",
    req.params.id,
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        var idArray = [];
        for (var i = 0; i < sqlRes.length; i++)
        {
          idArray.push(sqlRes[i].liked_by_user);
        }

        res.status(200).send(
        {
          success: true,
          count: Object.keys(sqlRes).length,
          info: idArray,
        });
      }
    }
  );
};

exports.send_like = function(req, res)
{
  if (sql.propertyCheck(req, res, ["user_id"]))
  {
    sql.connection.query(
      "INSERT INTO `like_on_trip` SET ?;",
      {
        liked_by_user: req.body.user_id,
        trip_id: req.params.id,
      },
      function(sqlErr, sqlRes)
      {
        if (sql.isSuccessfulQuery(sqlErr, res))
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully liked trip",
          });
        }
      }
    );
  }
};

exports.remove_like = function(req, res)
{
  sql.connection.query(
    "DELETE FROM `like_on_trip` WHERE `liked_by_user` = ? AND `trip_id` = ?;",
    [req.params.userId, req.params.id],
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        if (sqlRes.affectedRows == 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "No trip with id " + req.params.id + " & user with id " + req.params.userId + " found, like not removed",
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully unliked trip",
          });
        }
      }
    }
  );
}

exports.did_user_like = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `like_on_trip` WHERE `trip_id` = ? AND `liked_by_user` = ?;",
    [req.params.id, req.params.userId],
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
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