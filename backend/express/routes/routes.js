"use strict";

module.exports = function (app) {
  var userController = require("../model/user.js");

  app.route("/").get((req, res) => {
    res.status(200).send("API is running...");
  });

  app.route("/api/user/register").post(userController.create_user);
  app.route("/api/user/login").post(userController.login_user);
  app.route("/api/user/delete/:id").delete(userController.delete_user);
};
