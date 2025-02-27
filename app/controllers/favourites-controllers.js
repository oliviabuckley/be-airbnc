const {
  fetchFavourites,
  addPropertyFavourite,
  removePropertyFavourite,
} = require("../models/favourites-models");

const getFavourites = async (req, res, next) => {
  const { id } = req.params;
  try {
    const favourites = await fetchFavourites(id);
    res.status(200).send(favourites);
  } catch (err) {
    next(err);
  }
};

const postPropertyFavourite = async (req, res, next) => {
  const { id } = req.params;
  const propertyFavourite = req.body;

  try {
    const postedPropertyFavourite = await addPropertyFavourite(
      id,
      propertyFavourite
    );
    res.status(201).send(postedPropertyFavourite);
  } catch (err) {
    next(err);
  }
};

const deletePropertyFavourite = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedPropertyFavourite = await removePropertyFavourite(id);
    res.status(204).send(deletedPropertyFavourite);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFavourites,
  postPropertyFavourite,
  deletePropertyFavourite,
};
