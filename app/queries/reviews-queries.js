exports.fetchReviewsByPropertyIdQuery = `SELECT reviews.review_id,
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

exports.calculateAverageRatingQuery = `
    SELECT AVG(rating) AS average_rating
    FROM reviews
    WHERE property_id = $1;`;

exports.addReviewQuery = `INSERT INTO reviews(
    property_id, 
    guest_id, 
    rating,
    comment, 
    created_at) 
    VALUES(
    $1, $2, $3, $4, NOW())
    RETURNING *`;

exports.deleteReviewQuery = `DELETE FROM reviews
  WHERE review_id = $1`;
