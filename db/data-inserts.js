const db = require("./connection");
const format = require("pg-format");
const {
  createUserRef,
  createPropertyRef,
  formatProperties,
  formatFavourites,
  formatReviews,
} = require("./utils");

async function insertUsers(users) {
  const insertedUsers = await db.query(
    format(
      `INSERT INTO users (first_name, surname, email, phone_number, role, avatar) VALUES %L RETURNING *`,
      users.map(
        ({ first_name, surname, email, phone_number, role, avatar }) => [
          first_name,
          surname,
          email,
          phone_number,
          role,
          avatar,
        ]
      )
    )
  );
  return insertedUsers.rows;
}

async function insertPropertyTypes(propertyTypes) {
  return db.query(
    format(
      `INSERT INTO property_types (property_type, description) VALUES %L RETURNING *`,
      propertyTypes.map(({ property_type, description }) => [
        property_type,
        description,
      ])
    )
  );
}

async function insertProperties(properties, insertedUsers) {
  const userRef = createUserRef(insertedUsers);
  const formattedProperties = formatProperties(properties, userRef);
  const insertedProperties = await db.query(
    format(
      `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
      formattedProperties.map(
        ({
          host_id,
          name,
          location,
          property_type,
          price_per_night,
          description,
        }) => [
          host_id,
          name,
          location,
          property_type,
          price_per_night,
          description,
        ]
      )
    )
  );
  return insertedProperties.rows;
}

async function insertFavourites(favourites, insertedUsers, insertedProperties) {
  const userRef = createUserRef(insertedUsers);
  const propertyRef = createPropertyRef(insertedProperties);
  const formattedFavourites = formatFavourites(
    favourites,
    userRef,
    propertyRef
  );
  const insertedFavourites = await db.query(
    format(
      `INSERT INTO favourites (guest_id, property_id) VALUES %L RETURNING *`,
      formattedFavourites.map(({ guest_id, property_id }) => [
        guest_id,
        property_id,
      ])
    )
  );

  return insertedFavourites.rows;
}

async function insertReviews(reviews, insertedUsers, insertedProperties) {
  const userRef = createUserRef(insertedUsers);
  const propertyRef = createPropertyRef(insertedProperties);
  const formattedReviews = formatReviews(reviews, userRef, propertyRef);
  const insertedReviews = await db.query(
    format(
      `INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES %L RETURNING *`,
      formattedReviews.map(({ property_id, guest_id, rating, comment }) => [
        property_id,
        guest_id,
        rating,
        comment,
      ])
    )
  );
  return insertedReviews.rows;
}

module.exports = {
  insertUsers,
  insertPropertyTypes,
  insertProperties,
  insertFavourites,
  insertReviews,
};
