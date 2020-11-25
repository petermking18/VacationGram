"use strict";
var sql = require("./connection.js");

var User = function (user) {
  this.name = user.name;
  this.birthdate = user.birthdate;
  this.location = user.location;
  this.bio = user.bio;
  this.email = user.email;
  this.password = user.password;
  this.date_joined = user.date_joined;
  this.username = user.username;
};

User.createUser = function (newUser, result) {
  sql.connection.query(
    {
      sql: "INSERT INTO `user` SET ?;",
      values: newUser,
    },
    function (err, res) {
      if (err) {
        result(
          {
            code: 204,
            response: err,
          },
          null
        );
      } else {
        result(null, {
          code: 200,
          response: res,
        });
      }
    }
  );
};

exports.create_user = function (req, res) {
  if (sql.propertyCheck(req, res, ["name", "email", "password", "username"])) {
    var newUser = new User(req.body);
    newUser.date_joined = new Date();

    User.createUser(newUser, function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json(user);
      }
    });
  }
};

User.loginUser = function (loginUser, result) {
  sql.connection.query(
    {
      sql: "SELECT * FROM `user` WHERE `email` = ? AND `password` = ?;",
      values: [loginUser.email, loginUser.password],
    },
    function (err, res) {
      if (err) {
        result(
          {
            code: 400,
            response: err,
          },
          null
        );
      } else {
        if (!Object.keys(res).length) {
          // empty res
          result(
            {
              code: 204,
              response: "Could not find matching email and password.",
            },
            null
          );
        } else {
          // non empty res
          result(null, {
            code: 200,
            response: res,
          });
        }
      }
    }
  );
};

exports.login_user = function (req, res) {
  if (sql.propertyCheck(req, res, ["email", "password"])) {
    var loginUser = new User(req.body);

    User.loginUser(loginUser, function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json(user);
      }
    });
  }
};

User.deleteUser = function (id, result) {
  sql.connection.query(
    {
      sql: "DELETE FROM `user` WHERE id = ?;",
      values: id,
    },
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

exports.delete_user = function (req, res) {
  if (!("id" in req.params)) {
    res.status(400).json({
      code: 400,
      response: "Missing required field: `id`",
    });
  } else {
    User.deleteUser(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      } else {
        res.json(user);
      }
    });
  }
};
