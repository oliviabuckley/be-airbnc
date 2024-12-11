const db = require("../../db/connection");
const { fetchPropertyById } = require("./properties-models");
const {
  fetchReviewsByPropertyIdQuery,
  calculateAverageRatingQuery,
  addReviewQuery,
  deleteReviewQuery,
} = require("../queries/reviews-queries");

async function fetchReviewsByPropertyId(id) {
  await fetchPropertyById(id);
  const propertyReviewsResult = await db.query(fetchReviewsByPropertyIdQuery, [
    id,
  ]);

  if (propertyReviewsResult.rows.length === 0) {
    return Promise.reject({
      status: 200,
      msg: "there are no reviews for this property yet",
    });
  }

  const averageRatingResult = await db.query(calculateAverageRatingQuery, [id]);

  const propertyReviews = propertyReviewsResult.rows;

  const averageRating =
    averageRatingResult.rows.length > 0
      ? averageRatingResult.rows[0].average_rating
      : null;

  const averageRatingRounded = parseFloat(averageRating).toFixed(1);

  return { propertyReviews, average_rating: Number(averageRatingRounded) };
}

async function addPropertyReview(id, propertyReview) {
  const { guest_id, rating, comment } = propertyReview;

  if (!guest_id || rating === undefined || !comment) {
    return Promise.reject({ status: 400, msg: "missing required fields" });
  }

  const guestCheck = await db.query(
    "SELECT * FROM users WHERE user_id = $1 AND role = $2",
    [guest_id, "guest"]
  );

  if (guestCheck.rows.length === 0) {
    return Promise.reject({
      status: 400,
      msg: `guest with ID ${guest_id} not found or not a guest`,
    });
  }

  if (rating < 1 || rating > 5) {
    return Promise.reject({
      status: 400,
      msg: "rating must be between 1 and 5",
    });
  }

  const existingReview = await db.query(
    `SELECT * FROM reviews WHERE property_id = $1 AND guest_id = $2`,
    [id, guest_id]
  );

  if (existingReview.rows.length > 0) {
    return Promise.reject({
      status: 400,
      msg: "guest has already reviewed this property",
    });
  }

  const addedPropertyReview = await db.query(addReviewQuery, [
    id,
    guest_id,
    rating,
    comment,
  ]);
  return addedPropertyReview.rows[0];
}

async function removePropertyReview(id) {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      msg: "invalid review ID, must be a number",
    });
  }
  const propertyReview = await db.query(
    `SELECT * FROM reviews WHERE review_id = $1`,
    [id]
  );

  if (propertyReview.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `review with ID ${id} not found`,
    });
  }

  const deletedReview = await db.query(deleteReviewQuery, [id]);

  return deletedReview.rows[0];
}

module.exports = {
  fetchReviewsByPropertyId,
  addPropertyReview,
  removePropertyReview,
};