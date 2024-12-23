const path = require("path");

const serveDocs = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "index.html"));
};

module.exports = { serveDocs };
