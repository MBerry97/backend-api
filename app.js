const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const { handleInvalidPath, handle404s } = require("./errors");

app.use("/api", apiRouter);

app.all("/*", handleInvalidPath);

app.use(handle404s);

module.exports = app;
