const express = require("express");
const { serveDocs } = require("../controllers/docs-controllers");
const docsRouter = express.Router();

docsRouter.get("/", serveDocs);

module.exports = docsRouter;
