const express = require("express");
const app = express();
const { handlePathNotFound, handleCustomErrors } = require("./errors");
const propertiesRouter = require("./routes/properties-routes");
const usersRouter = require("./routes/users-routes");
const reviewsRouter = require("./routes/reviews-routes");
const favouritesRouter = require("./routes/favourites-routes");
const docsRouter = require("./routes/docs-routes");
const path = require("path");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", docsRouter);

app.use("/api/properties", propertiesRouter);

app.use("/api/reviews", reviewsRouter);

app.use("/api/favourites", favouritesRouter);

app.use("/api/users", usersRouter);

app.all("/*", handlePathNotFound);

app.use(handleCustomErrors);

module.exports = app;
