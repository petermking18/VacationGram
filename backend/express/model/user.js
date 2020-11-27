"use strict";
var sql = require("./connection.js");

var User = function(user)
{
  this.name = user.name;
  this.birthdate = user.birthdate;
  this.location = user.location;
  this.bio = user.bio;
  this.email = user.email;
  this.password = user.password;
  this.date_joined = user.date_joined;
  this.username = user.username;
};

exports.get_users = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `user`;",
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

exports.create_user = function(req, res)
{
  if (sql.propertyCheck(req, res, ["name", "email", "password", "username"]))
  {
    var newUser = new User(req.body);
    newUser.date_joined = new Date();

    sql.connection.query(
      "INSERT INTO `user` SET ?;",
      newUser,
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
            response: "Succesfully created user",
            info: sqlRes.insertId,
          });
        }
      }
    );
  }
};

exports.login_user = function(req, res)
{
  if (sql.propertyCheck(req, res, ["email", "password"]))
  {
    var loginUser = new User(req.body);

    sql.connection.query(
      "SELECT * FROM `user` WHERE `email` = ?;",
      loginUser.email,
      function(sqlErr, sqlRes)
      {
        if (sqlErr)
        {
          sql.respondSqlError(sqlErr, res);
        }
        else
        {
          if (!Object.keys(sqlRes).length)
          {
            res.status(401).send(
            {
              success: false,
              response: "Email not found",
            });
          }
          else
          {
            if (sqlRes[0].password == loginUser.password)
            {
              res.status(200).send(
              {
                success: true,
                response: "Successfully logged in",
                info: sqlRes,
              });
            }
            else
            {
              res.status(401).send(
              {
                success: false,
                response: "Password does not match email",
              });
            }
          }
        }
      }
    );
  }
};

exports.get_user = function(req, res)
{
  if (!("id" in req.params))
  {
    res.status(400).send(
    {
      success: false,
      response: "Missing required field: `id`",
    });
  }
  else
  {
    sql.connection.query(
      "SELECT * FROM `user` WHERE id = ?;",
      req.params.id,
      function(sqlErr, sqlRes)
      {
        if (sqlErr)
        {
          sql.respondSqlError(sqlErr, res);
        }
        else if (sqlRes.length <= 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "Couldn't find user " + req.params.id,
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully found user " + req.params.id,
            info: sqlRes,
          });
        }
      }
    );
  }
}

exports.delete_user = function(req, res)
{
  if (!("id" in req.params))
  {
    res.status(400).send(
    {
      success: false,
      response: "Missing required field: `id`",
    });
  }
  else
  {
    sql.connection.query(
      "DELETE FROM `user` WHERE id = ?;",
      req.params.id,
      function(sqlErr, sqlRes)
      {
        if (sqlErr)
        {
          sql.respondSqlError(sqlErr, res);
        }
        else if (sqlRes.affectedRows == 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "No user with id " + req.params.id + " found, nothing deleted",
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully deleted user",
            info: sqlRes,
          });
        }
      }
    );
  }
};

exports.get_trips = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `trip` WHERE user_id = ?;",
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

exports.get_saved_trips = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `user_saved_trip` WHERE saved_by_user_id = ?;"
    req.params.id,
    function(sqlErr, sqlRes)
    {
      if (sqlErr)
      {
        sql.respondSqlError(sqlErr, sqlRes);
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

exports.did_save_trip = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `user_saved_trip` WHERE saved_by_user_id = ? AND trip_id = ?;" [req.params.id, req.params.tripId],
    function(sqlErr, sqlRes)
    {
      if (sqlErr)
      {
        sql.respondSqlError(sqlErr, sqlRes);
      }
      else
      {
        res.status(200).send(
        {
          success: true,
          did_save: sqlRes.length > 0,
        });
      }
    }
  );
}