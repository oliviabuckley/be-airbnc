const db = require("./connection");
const format = require("pg-format");
const { createRef, formatProperties } = require("./utils");

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
  const userRef = createRef(insertedUsers);
  const formattedProperties = formatProperties(properties, userRef);
  return db.query(
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
}

module.exports = { insertUsers, insertPropertyTypes, insertProperties };
