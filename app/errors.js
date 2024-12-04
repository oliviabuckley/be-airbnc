const handlePathNotFound = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

const handleMethodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

module.exports = {
  handlePathNotFound,
  handleMethodNotAllowed,
  handleCustomErrors,
};
