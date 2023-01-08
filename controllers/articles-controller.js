const {
  selectArticles,
  selectArticlesById,
  updateArticleVotes,
  insertArticle,
  removeArticle,
} = require("../models/news-model");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, p } = req.query;
  selectArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(inc_votes, article_id)
    .then((result) => {
      const article = result[0];
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body } = req.body;
  insertArticle(title, topic, author, body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
