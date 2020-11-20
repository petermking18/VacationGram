const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST);
console.log("API server started on: " + PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

var routes = require("./express/routes/routes.js");
routes(app);
