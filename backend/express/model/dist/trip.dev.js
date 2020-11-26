"use strict";

var sql = require("./connection");

var Trip = function Trip(trip) {
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

Trip.createTrip = function (newTrip, result) {
  sql.connection.query({
    sql: "INSERT INTO `trip` SET ?;",
    values: newTrip
  }, function (err, res) {
    if (err) {
      result({
        code: 204,
        response: err
      }, null);
    } else {
      result(null, {
        code: 200,
        response: res
      });
    }
  });
};

exports.create_trip = function (req, res) {
  if (sql.propertyCheck(req, res, ["body", "destination", "rating", "title", "user_id", "is_public"])) {
    var newTrip = new Trip(req.body);
    newTrip.date_created = new Date();
    newTrip.date_last_updated = new Date();
    Trip.createTrip(newTrip, function (err, trip) {
      if (err) {
        res.send(err);
      } else {
        res.json(trip);
      }
    });
  } // var newTrip = new Trip(req.body);
  // newTrip.date_created = new Date();
  // newTrip.date_created =
  //   newTrip.date_created.getUTCFullYear() +
  //   "-" +
  //   ("00" + (newTrip.date_created.getUTCMonth() + 1)).slice(-2) +
  //   "-" +
  //   ("00" + newTrip.date_created.getUTCDate()).slice(-2) +
  //   " " +
  //   ("00" + newTrip.date_created.getUTCHours()).slice(-2) +
  //   ":" +
  //   ("00" + newTrip.date_created.getUTCMinutes()).slice(-2) +
  //   ":" +
  //   ("00" + newTrip.date_created.getUTCSeconds()).slice(-2);
  // newTrip.date_last_updated = newTrip.date_created;
  // if (
  //   !newTrip.body ||
  //   !newTrip.date_created ||
  //   !newTrip.destination ||
  //   !newTrip.rating ||
  //   !newTrip.title ||
  //   !newTrip.user_id
  // ) {
  //   res.status(400).json({
  //     code: 400,
  //     response: "Missing input field.",
  //   });
  // } else {
  //   Trip.createTrip(newTrip, function (err, trip) {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.json(trip);
  //     }
  //   });
  // }

};