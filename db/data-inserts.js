const db = require("./connection");
const format = require("pg-format");

function insertUsers(users) {
  return db.query(
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
}

function insertPropertyTypes(propertyTypes) {
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

function insertProperties(properties, users) {
  const propertiesWithHostIds = properties.map((property) => {
    const host = users.find((user) => user.role === "host");
    return {
      ...property,
      host_id: host ? host.user_id : null,
    };
  });
  return db.query(
    format(
      `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
      propertiesWithHostIds.map(
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
