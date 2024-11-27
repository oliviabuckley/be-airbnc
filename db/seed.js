const manageTables = require("./manage-tables");
const {
  insertUsers,
  insertPropertyTypes,
  insertProperties,
} = require("./data-inserts");

async function seed(users, propertyTypes, properties) {
  await manageTables();
  const insertedUsers = await insertUsers(users);
  await insertPropertyTypes(propertyTypes);
  await insertProperties(properties, insertedUsers);
}

module.exports = seed;
