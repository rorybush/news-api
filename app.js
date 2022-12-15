const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticlesById,
  getArticleCommentsById,
  postArticleCommentsById,
  patchArticleVotes,
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
app.get("/api/articles/:article_id/comments", getArticleCommentsById);
app.post("/api/articles/:article_id/comments", postArticleCommentsById);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.all("*", handle404Paths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
