const {
  selectArticleCommentsById,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentVotes,
} = require("../models/comments-model");
const { selectArticlesById } = require("../models/articles-model");

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    selectArticlesById(article_id),
    selectArticleCommentsById(article_id),
  ])
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleId(article_id, username, body)
    .then((body) => {
      const comment = body.rows[0];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVoteCount = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotes(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
