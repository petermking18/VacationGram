"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var cors = require("cors");

var app = express();
var PORT = process.env.PORT || 8000;
var HOST = "0.0.0.0";
app.listen(PORT, HOST);
console.log("API server started on: " + PORT);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());

var routes = require("./express/routes/routes.js");

routes(app);