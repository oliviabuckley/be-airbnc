const {
  fetchProperties,
  fetchPropertyById,
  fetchReviewsByPropertyId,
  addPropertyReview,
  removePropertyReview,
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

module.exports = {
  getProperties,
  getPropertyById,
  getReviewsByPropertyId,
  postPropertyReview,
  deletePropertyReview,
};
