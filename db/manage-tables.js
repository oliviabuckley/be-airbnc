const db = require("./connection");
const {
  createUsersQuery,
  createPropertiesQuery,
  createPropertyTypesQuery,
} = require("./queries");

async function manageTables() {
  await db.query(`DROP TABLE IF EXISTS properties;`);

  await db.query(`DROP TABLE IF EXISTS property_types, users;`);

  await db.query(createUsersQuery);

  await db.query(createPropertyTypesQuery);

  await db.query(createPropertiesQuery);
}

module.exports = manageTables;
