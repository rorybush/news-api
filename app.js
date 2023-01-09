const { getApi } = require("./controllers/api-controller");
const {
  handle404Paths,
  handleCustomErrors,
  handle500s,
  handlePsqlErrors,
} = require("./controllers/error.handler");

const cors = require("cors");
const apiRouter = require("./routes");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.get("/api/", getApi);

app.all("*", handle404Paths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
