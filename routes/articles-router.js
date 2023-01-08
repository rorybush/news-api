const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticlesById,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/articles-controller");
const {
  getArticleCommentsById,
  postArticleCommentsById,
} = require("../controllers/comments-controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticlesById);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.get("/:article_id/comments", getArticleCommentsById);
articlesRouter.post("/:article_id/comments", postArticleCommentsById);
articlesRouter.post("", postArticle);
articlesRouter.delete("/:article_id", deleteArticle);

module.exports = articlesRouter;
