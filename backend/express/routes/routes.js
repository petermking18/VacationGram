"use strict";

module.exports = function(app)
{
  var userController = require("../model/user");
  var tripController = require("../model/trip");
  var commentController = require("../model/comment");
  var savedTripController = require("../model/user_saved_trip")

  app.route("/").get(function(req, res)
  {
    res.status(200).send({ response: new Date(), });
  });

  // USER
  app.route("/api/user/").get(userController.get_users);
  app.route("/api/user/").post(userController.create_user);
  app.route("/api/user/:id").get(userController.get_user);
  app.route("/api/user/:id").delete(userController.delete_user);
  app.route("/api/user/:id/trips").get(userController.get_trips);
  app.route("/api/login").get(userController.login_user);

  // SAVED TRIPS
  app.route("/api/user/:id/saved").get(savedTripController.get_saved_trips);
  app.route("/api/user/:id/saved").post(savedTripController.save_trip);
  app.route("/api/user/:id/saved/:tripId").get(savedTripController.did_save_trip);
  app.route("/api/user/:id/saved/:tripId").delete(savedTripController.delete_saved_trip);

  // TRIP
  app.route("/api/trip").get(tripController.get_trips);
  app.route("/api/trip").post(tripController.create_trip);
  app.route("/api/trip/:id").get(tripController.get_trip);
  app.route("/api/trip/:id").delete(tripController.delete_trip);

  // TRIP LIKES
  app.route("/api/trip/:id/likes").get(tripController.get_likes);
  app.route("/api/trip/:id/likes/:userId").get(tripController.did_user_like);

  // COMMENT
  app.route("/api/trip/:id/comments").get(commentController.get_comments);
  app.route("/api/trip/:id/comments").post(commentController.create_comment);
};