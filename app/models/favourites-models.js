const db = require("../../db/connection");
const {
  addPropertyFavouriteQuery,
  deletePropertyFavouriteQuery,
} = require("../queries/favourites-queries");

async function addPropertyFavourite(id, propertyFavourite) {
  const { guest_id } = propertyFavourite;

  const propertyExists = await db.query(
    "SELECT * FROM properties WHERE property_id = $1",
    [id]
  );

  if (propertyExists.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `property with ID ${id} not found`,
    });
  }

  if (!guest_id) {
    return Promise.reject({ status: 400, msg: "missing required guest_id" });
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

  const addedPropertyFavourite = await db.query(addPropertyFavouriteQuery, [
    id,
    guest_id,
  ]);
  return {
    msg: "property favourited successfully",
    favourite_id: addedPropertyFavourite.rows[0].favourite_id,
  };
}

async function removePropertyFavourite(id) {
  const propertyFavourite = await db.query(
    `SELECT * FROM favourites WHERE favourite_id = $1`,
    [id]
  );

  if (propertyFavourite.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `favourite with ID ${id} not found`,
    });
  }

  const deletedFavourite = await db.query(deletePropertyFavouriteQuery, [id]);

  return deletedFavourite.rows[0];
}

module.exports = { addPropertyFavourite, removePropertyFavourite };
