const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticlesById,
} = require("./controllers/news-controller");
const { handle404Paths } = require("./controllers/error.handler");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.all("*", handle404Paths);

module.exports = app;
