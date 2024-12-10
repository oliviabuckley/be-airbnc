const express = require("express");
const app = express();
const {
  getProperties,
  getPropertyById,
  getReviewsByPropertyId,
  postPropertyReview,
  deletePropertyReview,
  postPropertyFavourite,
  deletePropertyFavourite,
} = require("./controllers");
const {
  getUserById,
  patchUserDetails,
} = require("../app/controllers/users-controllers");

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

app
  .route("/api/properties/:id/favourite")
  .post(postPropertyFavourite)
  .all(handleMethodNotAllowed);

app
  .route("/api/favourites/:id")
  .delete(deletePropertyFavourite)
  .all(handleMethodNotAllowed);

app
  .route("/api/users/:id")
  .get(getUserById)
  .patch(patchUserDetails)
  .all(handleMethodNotAllowed);

app.all("/*", handlePathNotFound);

app.use(handleCustomErrors);

module.exports = app;
