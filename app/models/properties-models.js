const db = require("../../db/connection");
const {
  fetchPropertiesQuery,
  fetchPropertyByIdQuery,
} = require("../queries/properties-queries");
const { validateId } = require("./utils");

async function fetchProperties(
  sortBy,
  order,
  maxPrice = null,
  minPrice = null,
  host = null
) {
  const validSortByColumns = ["price_per_night", "location", "favourites"];
  const validOrderValues = ["ASC", "DESC"];

  if (
    !validSortByColumns.includes(sortBy) ||
    !validOrderValues.includes(order)
  ) {
    return Promise.reject({
      status: 400,
      msg: "invalid sortBy or order",
    });
  }

  if (host) {
    const hostCheckResult = await db.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [host]
    );
    if (hostCheckResult.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `host with ID ${host} not found`,
      });
    }
  }

  if (maxPrice && isNaN(maxPrice)) {
    return Promise.reject({
      status: 400,
      msg: "maxPrice must be a number",
    });
  }

  if (minPrice && isNaN(minPrice)) {
    return Promise.reject({
      status: 400,
      msg: "minPrice must be a number",
    });
  }

  let queryStr = fetchPropertiesQuery;

  if (minPrice && maxPrice) {
    queryStr += ` WHERE properties.price_per_night >= $1 AND properties.price_per_night <= $2`;
  } else if (minPrice) {
    queryStr += ` WHERE properties.price_per_night >= $1`;
  } else if (maxPrice) {
    queryStr += ` WHERE properties.price_per_night <= $1`;
  }

  const values = [];

  if (host) {
    queryStr +=
      values.length > 0
        ? ` AND properties.host_id = $${values.length + 1}`
        : ` WHERE properties.host_id = $1`;
    values.push(host);
  }

  queryStr += ` GROUP BY properties.property_id, users.first_name, users.surname`;

  if (sortBy === "favourites") {
    queryStr += ` ORDER BY COUNT(favourites.property_id) ${order}`;
  } else {
    queryStr += ` ORDER BY ${sortBy} ${order}`;
  }

  if (minPrice) values.push(minPrice);
  if (maxPrice) values.push(maxPrice);
  const properties = await db.query(queryStr, values);

  return properties.rows;
}

async function fetchPropertyById(id) {
  await validateId(id);

  const property = await db.query(fetchPropertyByIdQuery, [id]);

  if (property.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `property with ID ${id} not found`,
    });
  }

  return property.rows[0];
}

module.exports = { fetchProperties, fetchPropertyById };
