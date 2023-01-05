const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticlesById,
  patchArticleVotes,
} = require("../controllers/articles-controller");
const {
  getArticleCommentsById,
  postArticleCommentsById,
} = require("../controllers/comment-controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.get("/:article_id/comments", getArticleCommentsById);
articlesRouter.post("/:article_id/comments", postArticleCommentsById);

module.exports = articlesRouter;
