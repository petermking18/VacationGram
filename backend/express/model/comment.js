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

exports.get_likes = function(req, res)
{
  sql.connection.query(
    "SELECT * FROM `like_on_comment` WHERE `comment_id` = ? GROUP BY `liked_by_user_id`;",
    req.params.commentId,
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        var idArray = [];
        for (var i = 0; i < sqlRes.length; i++)
        {
          idArray.push(sqlRes[i].liked_by_user_id);
        }

        res.status(200).send(
        {
          success: true,
          count: Object.keys(sqlRes).length,
          info: idArray,
        });
      }
    }
  );
};

exports.like_comment = function(req, res)
{
  if (sql.propertyCheck(req, res, ["user_id"]))
  {
    sql.connection.query(
      "INSERT INTO `like_on_comment` SET ?;",
      {
        liked_by_user_id: req.body.user_id,
        comment_id: req.params.commentId,
      },
      function(sqlErr, sqlRes)
      {
        if (sql.isSuccessfulQuery(sqlErr, res))
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully liked comment",
          });
        }
      }
    )
  }
}

exports.unlike_comment = function(req, res)
{
  sql.connection.query(
    "DELETE FROM `like_on_comment` WHERE `liked_by_user_id` = ? AND `comment_id` = ?;",
    [req.params.userId, req.params.commentId],
    function(sqlErr, sqlRes)
    {
      if (sql.isSuccessfulQuery(sqlErr, res))
      {
        if (sqlRes.affectedRows == 0)
        {
          res.status(200).send(
          {
            success: false,
            response: "No comment with id " + req.params.commentId + " & user with id " + req.params.userId + " found, like not removed",
          });
        }
        else
        {
          res.status(200).send(
          {
            success: true,
            response: "Successfully unliked comment",
          });
        }
      }
    }
  )
}