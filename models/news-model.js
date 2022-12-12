const db = require("../db/connection");

exports.selectTopics = () => {
  const query = `SELECT * FROM topics`;
  return db.query(query).then((result) => {
    return result;
  });
};

exports.selectArticles = () => {
  const query = `SELECT * FROM articles`;
  return db.query(query).then((result) => {
    return result.rows;
  });
};
