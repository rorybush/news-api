const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticlesById,
} = require("./controllers/news-controller");
const {
  handle404Paths,
  handleCustomErrors,
  handle500s,
  handlePsqlErrors,
} = require("./controllers/error.handler");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);

app.all("*", handle404Paths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
