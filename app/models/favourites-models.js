const db = require("../../db/connection");
const {
  fetchFavouritesQuery,
  addPropertyFavouriteQuery,
  deletePropertyFavouriteQuery,
} = require("../queries/favourites-queries");
const { fetchPropertyById } = require("./properties-models");
const { validateId } = require("./utils");

async function fetchFavourites(id) {
  await validateId(id);

  const favourites = await db.query(fetchFavouritesQuery, [id]);

  return favourites.rows;
}

async function addPropertyFavourite(id, propertyFavourite) {
  const { guest_id } = propertyFavourite;

  if (!guest_id) {
    return Promise.reject({ status: 400, msg: "missing required guest_id" });
  }

  try {
    // Check if the user exists (it could be either a guest or host)
    const userCheck = await db.query("SELECT * FROM users WHERE user_id = $1", [
      guest_id,
    ]);

    if (userCheck.rows.length === 0) {
      return Promise.reject({
        status: 400,
        msg: `user with ID ${guest_id} not found`,
      });
    }

    // Check if the property is already in the user's favourites
    const existingFavouriteCheck = await db.query(
      "SELECT * FROM favourites WHERE guest_id = $1 AND property_id = $2",
      [guest_id, id]
    );

    if (existingFavouriteCheck.rows.length > 0) {
      return Promise.reject({
        status: 400,
        msg: "This property is already in your favourites.",
      });
    }

    // Add the property to the user's favourites
    const addedPropertyFavourite = await db.query(addPropertyFavouriteQuery, [
      id,
      guest_id,
    ]);

    return {
      msg: "property favourited successfully",
      favourite_id: addedPropertyFavourite.rows[0].favourite_id,
    };
  } catch (error) {
    console.error("Error in adding property to favourites:", error);
    return Promise.reject({
      status: 500,
      msg: "Internal server error",
    });
  }
}

async function removePropertyFavourite(id) {
  await validateId(id);
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

module.exports = {
  fetchFavourites,
  addPropertyFavourite,
  removePropertyFavourite,
};
