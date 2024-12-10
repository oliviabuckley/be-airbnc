const { fetchUserById, updateUserDetails } = require("../models/users-models");

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await fetchUserById(id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const patchUserDetails = async (req, res, next) => {
  const { id } = req.params;
  const updatedDetails = req.body;
  try {
    const updatedUser = await updateUserDetails(id, updatedDetails);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserById, patchUserDetails };
