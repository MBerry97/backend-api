const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const {
  handleInvalidPath,
  handle404s,
  handle400s,
  psql404s,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidPath);

app.use(handle400s);
app.use(psql404s);
app.use(handle404s);

module.exports = app;
