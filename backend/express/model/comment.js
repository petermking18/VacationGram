"use strict";
var sql = require("./connection.js");

var Comment = function (comment) {
  this.date_created = comment.date_created;
  this.id = comment.id;
  this.is_question = comment.is_question;
  this.parent_comment_id = comment.parent_comment_id;
  this.trip_id = comment.trip_id;
  this.user_id = comment.user_id;
  this.body = comment.body;
};

Comment.createComment = function (newComment, result) {
  sql.connection.query(
    {
      sql: "INSERT INTO `comment` SET ?;",
      values: newComment,
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
        result(null, {
          code: 200,
          response: res,
        });
      }
    }
  );
};

exports.create_comment = function (req, res) {
  if (sql.propertyCheck(req, res, ["trip_id", "user_id", "body"])) {
    var newComment = new Comment(req.body);
    newComment.date_created = new Date();

    Comment.createComment(newComment, function (err, comment) {
      if (err) {
        res.send(err);
      } else {
        res.json(comment);
      }
    });
  }
};
