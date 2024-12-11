function validateId(id) {
  if (isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      msg: "invalid ID, must be a number",
    });
  } else {
    return Promise.resolve();
  }
}

module.exports = { validateId };
