const { selectTopics, selectArticles } = require("../models/news-model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(({ rows }) => {
      const topics = rows;
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};
