const { selectTopics } = require("../models/news-model");

exports.getTopics = (req, res) => {
  selectTopics().then(({ rows }) => {
    const topics = rows;
    res.status(200).send(topics);
  });
};
