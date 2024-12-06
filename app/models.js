const db = require("../db/connection");

async function fetchProperties(
  sortBy,
  order,
  maxPrice = null,
  minPrice = null,
  host = null
) {
  const validSortByColumns = ["price_per_night", "location", "favourites"];
  const validOrderValues = ["ASC", "DESC"];

  if (
    !validSortByColumns.includes(sortBy) ||
    !validOrderValues.includes(order)
  ) {
    return Promise.reject({
      status: 400,
      msg: "invalid sortBy or order",
    });
  }

  if (host) {
    const hostCheckResult = await db.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [host]
    );
    if (hostCheckResult.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `host with ID ${host} not found`,
      });
    }
  }

  if (maxPrice && isNaN(maxPrice)) {
    return Promise.reject({
      status: 400,
      msg: "maxPrice must be a number",
    });
  }

  if (minPrice && isNaN(minPrice)) {
    return Promise.reject({
      status: 400,
      msg: "minPrice must be a number",
    });
  }

  let queryStr = `SELECT 
    properties.property_id,
    properties.name AS property_name,
    properties.location,
    properties.price_per_night,
    CONCAT(users.first_name, ' ', users.surname) AS host,
    CAST(COUNT(favourites.property_id) AS INTEGER) AS favourites
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id`;

  if (minPrice && maxPrice) {
    queryStr += ` WHERE properties.price_per_night >= $1 AND properties.price_per_night <= $2`;
  } else if (minPrice) {
    queryStr += ` WHERE properties.price_per_night >= $1`;
  } else if (maxPrice) {
    queryStr += ` WHERE properties.price_per_night <= $1`;
  }

  const values = [];

  if (host) {
    queryStr +=
      values.length > 0
        ? ` AND properties.host_id = $${values.length + 1}`
        : ` WHERE properties.host_id = $1`;
    values.push(host);
  }

  queryStr += ` GROUP BY properties.property_id, users.first_name, users.surname`;

  if (sortBy === "favourites") {
    queryStr += ` ORDER BY COUNT(favourites.property_id) ${order}`;
  } else {
    queryStr += ` ORDER BY ${sortBy} ${order}`;
  }

  if (minPrice) values.push(minPrice);
  if (maxPrice) values.push(maxPrice);
  const properties = await db.query(queryStr, values);

  return properties.rows;
}

async function fetchPropertyById(id) {
  let queryStr = `SELECT 
  properties.property_id,
  properties.name AS property_name,
  properties.location,
  properties.price_per_night,
  properties.description,
  CONCAT(users.first_name, ' ', users.surname) AS host,
  users.avatar AS host_avatar,
  CAST(COUNT(favourites.property_id) AS INTEGER) AS favourites
FROM properties
JOIN users ON properties.host_id = users.user_id
LEFT JOIN favourites ON properties.property_id = favourites.property_id
WHERE properties.property_id = $1
GROUP BY properties.property_id, users.first_name, users.surname, users.avatar;`;

  const property = await db.query(queryStr, [id]);

  if (property.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `property with ID ${id} not found`,
    });
  }

  return property.rows[0];
}

async function fetchReviewsByPropertyId(id) {
  let queryStr = `SELECT reviews.review_id,
  reviews.comment,
  reviews.rating,
  reviews.created_at,
  CONCAT(users.first_name, ' ', users.surname) AS guest,
  users.avatar AS guest_avatar
  FROM reviews
  JOIN users ON reviews.guest_id = users.user_id
 JOIN properties ON reviews.property_id = properties.property_id
WHERE properties.property_id = $1
ORDER BY reviews.created_at DESC;`;

  const averageRatingQueryStr = `
    SELECT AVG(rating) AS average_rating
    FROM reviews
    WHERE property_id = $1;`;

  const propertyReviewsResult = await db.query(queryStr, [id]);
  const averageRatingResult = await db.query(averageRatingQueryStr, [id]);

  const propertyReviews = propertyReviewsResult.rows;
  const averageRating =
    averageRatingResult.rows.length > 0
      ? averageRatingResult.rows[0].average_rating
      : null;

  const averageRatingRounded = parseFloat(averageRating).toFixed(1);

  return { propertyReviews, average_rating: Number(averageRatingRounded) };
}

module.exports = {
  fetchProperties,
  fetchPropertyById,
  fetchReviewsByPropertyId,
};
