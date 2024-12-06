const express = require("express");
const app = express();
const {
  getProperties,
  getPropertyById,
  getReviewsByPropertyId,
} = require("./controllers");
const {
  handlePathNotFound,
  handleMethodNotAllowed,
  handleCustomErrors,
} = require("./errors");

app.route("/api/properties").get(getProperties).all(handleMethodNotAllowed);

app
  .route("/api/properties/:id")
  .get(getPropertyById)
  .all(handleMethodNotAllowed);

app.route("/api/properties/:id/reviews").get(getReviewsByPropertyId);

app.all("/*", handlePathNotFound);

app.use(handleCustomErrors);

module.exports = app;
