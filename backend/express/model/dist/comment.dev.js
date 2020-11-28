"use strict";

var sql = require("./connection.js");

var Comment = function Comment(comment) {
  this.date_created = comment.date_created;
  this.id = comment.id;
  this.is_question = comment.is_question;
  this.parent_comment_id = comment.parent_comment_id;
  this.trip_id = comment.trip_id;
  this.user_id = comment.user_id;
  this.body = comment.body;
};

exports.create_comment = function (req, res) {
  if (sql.propertyCheck(req, res, ["trip_id", "user_id", "body"])) {
    var newComment = new Comment(req.body);
    newComment.date_created = new Date();
    sql.connection.query("INSERT INTO `comment` SET ?;", newComment, function (sqlErr, sqlRes) {
      if (sqlErr) {
        sql.respondSqlError(sqlErr, res);
      } else {
        res.status(200).send({
          response: "Successfully created comment",
          info: sqlRes
        });
      }
    });
  }
};