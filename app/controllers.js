const {
  fetchProperties,
  fetchPropertyById,
  fetchReviewsByPropertyId,
  addPropertyReview,
  removePropertyReview,
  addPropertyFavourite,
  removePropertyFavourite,
  fetchUserById,
} = require("./models");

const getProperties = async (req, res, next) => {
  try {
    const {
      sortBy = "favourites",
      order = "DESC",
      maxPrice,
      minPrice,
      host,
    } = req.query;

    const properties = await fetchProperties(
      sortBy,
      order,
      maxPrice,
      minPrice,
      host
    );
    res.status(200).send({ properties });
  } catch (err) {
    next(err);
  }
};

const getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const property = await fetchPropertyById(id);
    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
};

const getReviewsByPropertyId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { propertyReviews, average_rating } = await fetchReviewsByPropertyId(
      id
    );
    res.status(200).send({
      propertyReviews,
      average_rating,
    });
  } catch (err) {
    next(err);
  }
};

const postPropertyReview = async (req, res, next) => {
  const { id } = req.params;
  const propertyReview = req.body;
  try {
    const postedPropertyReview = await addPropertyReview(id, propertyReview);
    res.status(201).send(postedPropertyReview);
  } catch (err) {
    next(err);
  }
};

const deletePropertyReview = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedPropertyReview = await removePropertyReview(id);
    res.status(204).send(deletedPropertyReview);
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

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await fetchUserById(id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  getReviewsByPropertyId,
  postPropertyReview,
  deletePropertyReview,
  postPropertyFavourite,
  deletePropertyFavourite,
  getUserById,
};
