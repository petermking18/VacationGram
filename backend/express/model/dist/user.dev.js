"use strict";

var sql = require("./connection.js");

var User = function User(user) {
  this.name = user.name;
  this.birthdate = user.birthdate;
  this.location = user.location;
  this.bio = user.bio;
  this.email = user.email;
  this.password = user.password;
  this.date_joined = user.date_joined;
  this.username = user.username;
};

exports.create_user = function (req, res) {
  if (sql.propertyCheck(req, res, ["name", "email", "password", "username"])) {
    var newUser = new User(req.body);
    newUser.date_joined = new Date();
    sql.connection.query("INSERT INTO `user` SET ?;", newUser, function (sqlErr, sqlRes) {
      if (sqlErr) {
        sql.respondSqlError(sqlErr, res);
      } else {
        res.status(200).send({
          response: "Succesfully created user",
          info: sqlRes
        });
      }
    });
  }
};

exports.login_user = function (req, res) {
  if (sql.propertyCheck(req, res, ["email", "password"])) {
    var loginUser = new User(req.body);
    sql.connection.query("SELECT * FROM `user` WHERE `email` = ? AND `password` = ?;", [loginUser.email, loginUser.password], function (sqlErr, sqlRes) {
      if (sqlErr) {
        sql.respondSqlError(sqlErr, res);
      } else {
        if (!Object.keys(sqlRes).length) {
          res.status(401).send({
            response: "No matching email and password"
          });
        } else {
          res.status(200).send({
            response: "Successfully logged in",
            info: sqlRes
          });
        }
      }
    });
  }
};

exports.delete_user = function (req, res) {
  if (!("id" in req.params)) {
    res.status(400).send({
      response: "Missing required field: `id`"
    });
  } else {
    sql.connection.query("DELETE FROM `user` WHERE id = ?;", req.params.id, function (sqlErr, sqlRes) {
      if (sqlErr) {
        sql.respondSqlError(sqlErr, res);
      } else if (sqlRes.affectedRows == 0) {
        res.status(200).send({
          response: "No user with id " + req.params.id + " found, nothing deleted"
        });
      } else {
        console.log(sqlRes);
        res.status(200).send({
          response: "Successfully deleted user",
          info: sqlRes
        });
      }
    });
  }
};