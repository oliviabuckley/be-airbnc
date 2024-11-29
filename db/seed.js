const manageTables = require("./manage-tables");
const {
  insertUsers,
  insertPropertyTypes,
  insertProperties,
  insertFavourites,
  insertReviews,
} = require("./data-inserts");

async function seed(users, propertyTypes, properties, favourites, reviews) {
  await manageTables();
  const insertedUsers = await insertUsers(users);
  await insertPropertyTypes(propertyTypes);
  const insertedProperties = await insertProperties(properties, insertedUsers);
  await insertFavourites(favourites, insertedUsers, insertedProperties);
  await insertReviews(reviews, insertedUsers, insertedProperties);
}

module.exports = seed;
