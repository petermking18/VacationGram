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
  sql.query(
    "INSERT INTO `db`.`user` (`name`, `email`, `password`, `date_joined`, `username`) VALUES ('" +
      newUser.name +
      "', '" +
      newUser.email +
      "', '" +
      newUser.password +
      "', '" +
      newUser.date_joined +
      "', '" +
      newUser.username +
      "');",
    function (err, res) {
      if (err) {
        result(
          {
            code: 204,
            response: "Could not create new user.",
          },
          null
        );
      } else {
        result(null, {
          code: 200,
          response: "Created new user.",
        });
      }
    }
  );
};

exports.create_user = function (req, res) {
  var newUser = new User(req.body);
  newUser.date_joined = new Date();
  newUser.date_joined =
    newUser.date_joined.getUTCFullYear() +
    "-" +
    ("00" + (newUser.date_joined.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + newUser.date_joined.getUTCDate()).slice(-2) +
    " " +
    ("00" + newUser.date_joined.getUTCHours()).slice(-2) +
    ":" +
    ("00" + newUser.date_joined.getUTCMinutes()).slice(-2) +
    ":" +
    ("00" + newUser.date_joined.getUTCSeconds()).slice(-2);

  if (
    !newUser.name ||
    !newUser.email ||
    !newUser.password ||
    !newUser.username ||
    !newUser.date_joined
  ) {
    res.status(400).json({
      code: 400,
      response: "Missing input field.",
    });
  } else {
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
  sql.query(
    "SELECT * FROM `db`.`user` WHERE email = ?;",
    [loginUser.email],
    function (err, res) {
      if (err) {
        result({ code: 400, response: "Fatal SQL error ocurred" }, null);
      } else {
        if (res.length <= 0) {
          result(
            {
              code: 204,
              response: "Email not found.",
            },
            null
          );
        } else {
          if (res[0].password == loginUser.password) {
            result(null, {
              code: 200,
              response: "Login successful.",
              id: res[0].id,
              name: res[0].name,
              birthdate: res[0].birthdate,
              location: res[0].location,
              bio: res[0].bio,
              date_joined: res[0].date_joined,
              username: res[0].username,
            });
          } else {
            result(
              {
                code: 204,
                response: "Email and password do not match.",
              },
              null
            );
          }
        }
      }
    }
  );
};

exports.login_user = function (req, res) {
  var loginUser = new User(req.body);

  if (!loginUser.email || !loginUser.password) {
    res.status(400).json({
      code: 400,
      response: "Missing email or password.",
    });
  } else {
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
  sql.query("DELETE from `db`.`user` WHERE id = ?;", [id], function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, {
        code: 200,
        response: "Deleted user with id=" + id,
      });
    }
  });
};

exports.delete_user = function (req, res) {
  if (!req.params.id) {
    res.status(400).json({
      code: 400,
      response: "Missing ID in request.",
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
