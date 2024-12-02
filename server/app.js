const express = require("express");
const app = express();
const { getProperties } = require("./controllers");
const { handlePathNotFound, handleMethodNotAllowed } = require("./errors");

app.route("/api/properties").get(getProperties).delete(handleMethodNotAllowed);

app.all("/*", handlePathNotFound);

module.exports = app;
