const { getApi } = require("./controllers/api-controller");
const {
  handle404Paths,
  handleCustomErrors,
  handle500s,
  handlePsqlErrors,
} = require("./controllers/error.handler");
const { getTopics } = require("./controllers/topics-controller");
const {
  getArticles,
  getArticlesById,
  patchArticleVotes,
} = require("./controllers/articles-controller");
const {
  getArticleCommentsById,
  postArticleCommentsById,
  deleteCommentById,
} = require("./controllers/comment-controller");
const { getUsers } = require("./controllers/users-controller");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);
app.post("/api/articles/:article_id/comments", postArticleCommentsById);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/", getApi);

app.all("*", handle404Paths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
