const {
  fetchReviewsByPropertyId,
  addPropertyReview,
  removePropertyReview,
} = require("../models/reviews-models");

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
  getReviewsByPropertyId,
  postPropertyReview,
  deletePropertyReview,
};
