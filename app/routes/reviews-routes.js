const express = require("express");
const { deletePropertyReview } = require("../controllers/reviews-controllers");
const { handleMethodNotAllowed } = require("../errors");

const reviewsRouter = express.Router();

reviewsRouter
  .route("/:id")
  .delete(deletePropertyReview)
  .all(handleMethodNotAllowed);

module.exports = reviewsRouter;
