exports.addPropertyFavouriteQuery = `INSERT INTO favourites(
    property_id, 
    guest_id) 
    VALUES(
    $1, $2)
    RETURNING favourite_id`;

exports.deletePropertyFavouriteQuery = `DELETE FROM favourites
  WHERE favourite_id = $1`;
