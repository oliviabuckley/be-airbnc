const handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

const handleMethodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

module.exports = { handlePathNotFound, handleMethodNotAllowed };
