const express = require("express");
const {
  deletePropertyFavourite,
} = require("../controllers/favourites-controllers");
const { handleMethodNotAllowed } = require("../errors");

const favouritesRouter = express.Router();

favouritesRouter
  .route("/:id")
  .delete(deletePropertyFavourite)
  .all(handleMethodNotAllowed);

module.exports = favouritesRouter;
