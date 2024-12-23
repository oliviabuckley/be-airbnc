const path = require("path");

const serveDocs = (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
};

module.exports = { serveDocs };
