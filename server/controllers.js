const { fetchProperties } = require("./models");

const getProperties = async (req, res) => {
  const properties = await fetchProperties();
  res.send({ properties });
};

module.exports = { getProperties };
