const db = require("./connection");
const seed = require("./seed");
const {
  favouritesData,
  propertiesData,
  propertyTypesData,
  reviewsData,
  usersData,
} = require("../db/data/test/index");

async function runSeed() {
  await seed(
    usersData,
    propertyTypesData,
    propertiesData,
    favouritesData,
    reviewsData
  );
  db.end();
}
runSeed();
