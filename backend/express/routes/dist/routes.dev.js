"use strict";

module.exports = function (app) {
  var userController = require("../model/user");

  var tripController = require("../model/trip");

  var commentController = require("../model/comment");

  app.route("/").get(function (req, res) {
    res.status(200).send({
      response: "API is running..."
    });
  }); // USER

  app.route("/api/user/register").post(userController.create_user);
  app.route("/api/user/login").post(userController.login_user);
  app.route("/api/user/delete/:id")["delete"](userController.delete_user); // TRIP

  app.route("/api/trip/create").post(tripController.create_trip); // COMMENT

  app.route("/api/trip/:id/comment").post(commentController.create_comment);
};