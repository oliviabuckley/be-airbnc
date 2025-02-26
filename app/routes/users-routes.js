const express = require("express");
const {
  getUserById,
  patchUserDetails,
} = require("../controllers/users-controllers");
const { getFavourites } = require("../controllers/favourites-controllers");
const { handleMethodNotAllowed } = require("../errors");

const usersRouter = express.Router();

usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(patchUserDetails)
  .all(handleMethodNotAllowed);

usersRouter
  .route("/:id/favourites")
  .get(getFavourites)
  .all(handleMethodNotAllowed);

module.exports = usersRouter;
