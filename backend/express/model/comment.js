"use strict";
var sql = require("./connection.js");

var Comment = function(comment)
{
  this.date_created = comment.date_created;
  this.id = comment.id;
  this.is_question = comment.is_question;
  this.parent_comment_id = comment.parent_comment_id;
  this.trip_id = comment.trip_id;
  this.user_id = comment.user_id;
  this.body = comment.body;
};

exports.create_comment = function(req, res)
{
  if (sql.propertyCheck(req, res, ["user_id", "body"]))
  {
    var newComment = new Comment(req.body);
    newComment.date_created = new Date();
    newComment.trip_id = req.params.id;

    sql.connection.query(
      "INSERT INTO `comment` SET ?;",
      newComment,
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
            response: "Successfully created comment",
            info: sqlRes.insertId,
          });
        }
      }
    );
  }
};

exports.get_comments = function(req, res)
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
      "SELECT * FROM `comment` WHERE trip_id = ?;",
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
            response: "No commments found for post " + req.params.id,
          })
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully found comments for trip " + req.params.id,
            info: sqlRes,
          });
        }
      }
    );
  }
}