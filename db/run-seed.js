const db = require("./connection");
const seed = require("./seed");
const users = require("./data/test/users.json");
const propertyTypes = require("./data/test/property-types.json");
const properties = require("./data/test/properties.json");

async function runSeed() {
  console.log(users);
  await seed(users, propertyTypes, properties);
  db.end();
}
