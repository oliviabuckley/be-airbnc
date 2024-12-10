const db = require("../../db/connection");
const {
  fetchUserByIdQuery,
  updateUserQuery,
} = require("../queries/users-queries");

async function fetchUserById(id) {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      msg: "invalid user ID, must be a number",
    });
  }

  const user = await db.query(fetchUserByIdQuery, [id]);

  if (user.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `user with ID ${id} not found`,
    });
  }

  return user.rows[0];
}

async function updateUserDetails(id, updatedDetails) {
  await fetchUserById(id);

  const { first_name, surname, email, phone, avatar } = updatedDetails;

  const validFields = ["first_name", "surname", "email", "phone", "avatar"];

  let updateClauses = [];
  let values = [];
  const invalidFields = Object.keys(updatedDetails).filter(
    (key) => !validFields.includes(key)
  );

  if (invalidFields.length > 0) {
    return Promise.reject({
      status: 400,
      msg: `invalid fields: ${invalidFields.join(", ")}`,
    });
  }

  if (first_name) {
    updateClauses.push({ key: "first_name", value: first_name });
    values.push(first_name);
  }
  if (surname) {
    updateClauses.push({ key: "surname", value: surname });
    values.push(surname);
  }
  if (email) {
    updateClauses.push({ key: "email", value: email });
    values.push(email);
  }
  if (phone) {
    updateClauses.push({ key: "phone_number", value: phone });
    values.push(phone);
  }
  if (avatar) {
    updateClauses.push({ key: "avatar", value: avatar });
    values.push(avatar);
  }

  if (updateClauses.length === 0) {
    return Promise.reject({
      status: 400,
      msg: "no valid fields to update",
    });
  }

  values.push(id);

  const updateClausesString = updateClauses
    .map((clause) => `${clause.key} = $${values.indexOf(clause.value) + 1}`)
    .join(", ");

  const query = `
    UPDATE users
    SET ${updateClausesString}
    WHERE user_id = $${values.length}
    RETURNING *;
  `;
  const updatedUser = await db.query(query, values);

  return updatedUser.rows[0];
}

module.exports = { fetchUserById, updateUserDetails };
