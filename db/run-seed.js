const db = require("./connection");
const seed = require("./seed");
const users = require("./data/test/users.json");
const propertyTypes = require("./data/test/property-types.json");
const properties = require("./data/test/properties.json");
const favourites = require("./data/test/favourites.json");
const reviews = require("./data/test/reviews.json");

async function runSeed() {
  await seed(users, propertyTypes, properties, favourites, reviews);
  db.end();
}
runSeed();
