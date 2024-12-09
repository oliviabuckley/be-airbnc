const express = require("express");
const app = express();
const {
  getProperties,
  getPropertyById,
  getReviewsByPropertyId,
  postPropertyReview,
  deletePropertyReview,
} = require("./controllers");
const {
  handlePathNotFound,
  handleMethodNotAllowed,
  handleCustomErrors,
} = require("./errors");

app.use(express.json());

app.route("/api/properties").get(getProperties).all(handleMethodNotAllowed);

app
  .route("/api/properties/:id")
  .get(getPropertyById)
  .all(handleMethodNotAllowed);

app
  .route("/api/properties/:id/reviews")
  .get(getReviewsByPropertyId)
  .post(postPropertyReview)
  .all(handleMethodNotAllowed);

app
  .route("/api/reviews/:id")
  .delete(deletePropertyReview)
  .all(handleMethodNotAllowed);

app.all("/*", handlePathNotFound);

app.use(handleCustomErrors);

module.exports = app;
