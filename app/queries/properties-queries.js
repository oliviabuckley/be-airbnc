exports.fetchPropertiesQuery = `SELECT 
    properties.property_id,
    properties.name AS property_name,
    properties.location,
    properties.price_per_night,
    CONCAT(users.first_name, ' ', users.surname) AS host,
    CAST(COUNT(favourites.property_id) AS INTEGER) AS favourites
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id`;

exports.fetchPropertyByIdQuery = `SELECT 
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
