"use strict";
const { json } = require("body-parser");
var sql = require("./connection.js");

var Comment = function(comment)
{
  this.date_created = comment.date_created;
  this.id = comment.id;
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
        if (sql.isSuccessfulQuery(sqlErr, res))
        {
          sql.connection.query(
            "SELECT * FROM `comment` WHERE `id` = ?;",
            sqlRes.insertId,
            function(subErr, subRes)
            {
              if (sql.isSuccessfulQuery(subErr, res))
              {
                res.status(200).send(
                {
                  success: true,
                  response: "Successfully created comment",
                  info: subRes,
                });
              }
            }
          )

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
        if (sql.isSuccessfulQuery(sqlErr, res))
        {
          if (sqlRes.length <= 0)
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
              count: Object.keys(sqlRes).length,
              info: sqlRes,
            });
          }
        }
      }
    );
  }
}

exports.delete_comment = function(req, res)
{
  sql.connection.query(
    "DELETE FROM `comment` WHERE `trip_id` = ? AND `id` = ?;",
    [req.params.id, req.params.commentId],
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        if (sqlRes.affectedRows == 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "No trip with id " + req.params.id + " & comment with id " + req.params.commentId + " found, comment not deleted",
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully deleted comment " + req.params.commentId,
          });
        }
      }
    }
  );
}