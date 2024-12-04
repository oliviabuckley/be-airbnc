const express = require("express");
const app = express();
const { getProperties } = require("./controllers");
const {
  handlePathNotFound,
  handleMethodNotAllowed,
  handleCustomErrors,
} = require("./errors");

app.route("/api/properties").get(getProperties).delete(handleMethodNotAllowed);

app.all("/*", handlePathNotFound);

app.use(handleCustomErrors);

module.exports = app;
