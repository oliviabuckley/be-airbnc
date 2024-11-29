exports.createUsersQuery = `CREATE TABLE users(
user_id SERIAL PRIMARY KEY, 
first_name VARCHAR NOT NULL,
surname VARCHAR NOT NULL,
email VARCHAR NOT NULL,
phone_number VARCHAR, 
role VARCHAR CHECK (role IN ('host', 'guest')) NOT NULL,
avatar VARCHAR,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

exports.createPropertyTypesQuery = `CREATE TABLE property_types(
property_type VARCHAR PRIMARY KEY,
description TEXT);`;

exports.createPropertiesQuery = `CREATE TABLE properties(
property_id SERIAL PRIMARY KEY,
host_id INT NOT NULL,
name VARCHAR NOT NULL,
location VARCHAR NOT NULL,
property_type VARCHAR NOT NULL,
price_per_night DECIMAL,
description TEXT,
FOREIGN KEY (host_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (property_type) REFERENCES property_types(property_type) ON DELETE RESTRICT);`;

exports.createFavouritesQuery = `CREATE TABLE favourites(
favourite_id SERIAL PRIMARY KEY,
guest_id INT NOT NULL,
property_id INT NOT NULL,
FOREIGN KEY (guest_id) REFERENCES users(user_id) ON DELETE CASCADE,
FOREIGN KEY (property_id) REFERENCES properties(property_id));`;

exports.createReviewsQuery = `CREATE TABLE reviews(
review_id SERIAL PRIMARY KEY,
property_id INT NOT NULL,
guest_id INT NOT NULL, 
rating INT NOT NULL,
comment TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (property_id) REFERENCES properties(property_id),
FOREIGN KEY (guest_id) REFERENCES users(user_id));`;
