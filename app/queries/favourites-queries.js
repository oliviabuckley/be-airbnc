exports.fetchFavouritesQuery = `
  SELECT properties.*
  FROM favourites
  JOIN properties ON favourites.property_id = properties.property_id
  WHERE favourites.guest_id = $1;
`;

exports.addPropertyFavouriteQuery = `INSERT INTO favourites(
    property_id, 
    guest_id) 
    VALUES(
    $1, $2)
    RETURNING favourite_id`;

exports.deletePropertyFavouriteQuery = `DELETE FROM favourites
  WHERE favourite_id = $1`;
