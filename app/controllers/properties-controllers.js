const {
  fetchProperties,
  fetchPropertyById,
} = require("../models/properties-models");

const getProperties = async (req, res, next) => {
  try {
    const {
      sortBy = "favourites",
      order = "DESC",
      maxPrice,
      minPrice,
      host,
    } = req.query;

    const properties = await fetchProperties(
      sortBy,
      order,
      maxPrice,
      minPrice,
      host
    );
    res.status(200).send({ properties });
  } catch (err) {
    next(err);
  }
};

const getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const property = await fetchPropertyById(id);
    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProperties, getPropertyById };
