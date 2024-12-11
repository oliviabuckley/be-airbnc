const express = require("express");
const {
  getProperties,
  getPropertyById,
} = require("../controllers/properties-controllers");

const {
  getReviewsByPropertyId,
  postPropertyReview,
} = require("../controllers/reviews-controllers");

const {
  postPropertyFavourite,
} = require("../controllers/favourites-controllers");

const { handleMethodNotAllowed } = require("../errors");

const propertiesRouter = express.Router();

propertiesRouter.route("/").get(getProperties).all(handleMethodNotAllowed);

propertiesRouter.route("/:id").get(getPropertyById).all(handleMethodNotAllowed);

propertiesRouter
  .route("/:id/reviews")
  .get(getReviewsByPropertyId)
  .post(postPropertyReview)
  .all(handleMethodNotAllowed);

propertiesRouter
  .route("/:id/favourite")
  .post(postPropertyFavourite)
  .all(handleMethodNotAllowed);

module.exports = propertiesRouter;
