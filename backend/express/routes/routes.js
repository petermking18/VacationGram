"use strict";

module.exports = function(app)
{
  var userController = require("../model/user");
  var tripController = require("../model/trip");
  var commentController = require("../model/comment");
  var savedTripController = require("../model/user_saved_trip");
  var reactionController = require("../model/reaction");

  app.route("/").get(function(req, res)
  {
    res.status(200).send({ response: new Date(), });
  });

  // USER
  app.route("/api/users/").get(userController.get_users);
  app.route("/api/users/").post(userController.create_user);
  app.route("/api/users/:id").get(userController.get_user);
  app.route("/api/users/:id").delete(userController.delete_user);
  app.route("/api/users/:id/trips").get(userController.get_trips);
  app.route("/api/login").post(userController.login_user);

  // SAVED TRIPS
  app.route("/api/users/:id/saved").get(savedTripController.get_saved_trips);
  app.route("/api/users/:id/saved").post(savedTripController.save_trip);
  app.route("/api/users/:id/saved/:tripId").get(savedTripController.did_save_trip);
  app.route("/api/users/:id/saved/:tripId").delete(savedTripController.delete_saved_trip);

  // TRIP
  app.route("/api/trips").get(tripController.get_trips);
  app.route("/api/trips").post(tripController.create_trip);
  app.route("/api/trips/:id").get(tripController.get_trip);
  app.route("/api/trips/:id").delete(tripController.delete_trip);

  // TRIP LIKES
  app.route("/api/trips/:id/likes").get(tripController.get_likes);
  app.route("/api/trips/:id/likes").post(tripController.send_like);
  app.route("/api/trips/:id/likes/:userId").get(tripController.did_user_like);
  app.route("/api/trips/:id/likes/:userId").delete(tripController.remove_like);

  // COMMENT
  app.route("/api/trips/:id/comments").get(commentController.get_comments);
  app.route("/api/trips/:id/comments").post(commentController.create_comment);
  app.route("/api/trips/:id/comments/:commentId").delete(commentController.delete_comment);

  // REACTIONS
  app.route("/api/reactions/:id").get(reactionController.get_reaction_name);
};