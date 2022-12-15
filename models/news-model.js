const db = require("../db/connection");

exports.selectTopics = () => {
  const query = `SELECT * FROM topics;`;
  return db.query(query).then((result) => {
    return result;
  });
};

exports.selectArticles = () => {
  const query = `
  SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, 
  COUNT(comments.article_id)::INTEGER AS comment_count
  FROM articles  
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;
`;

  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.selectArticlesById = (article_id) => {
  const query = `SELECT * FROM articles WHERE article_id= $1`;

  return db.query(query, [article_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "No Article Found." });
    }
    return result.rows[0];
  });
};

exports.selectArticleCommentsById = (article_id) => {
  const query = `SELECT comment_id, votes, created_at, author, body 
  FROM comments 
  WHERE article_id = $1
  ORDER BY created_at ASC;`;

  return db.query(query, [article_id]).then((result) => {
    return result.rows;
  });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Username or Body has not been provided.",
    });
  }
  const query = `
  INSERT INTO comments (article_id, author, body) 
  VALUES ($1, $2, $3) 
  RETURNING *;`;

  return db.query(query, [article_id, username, body]);
};

exports.updateArticleVotes = (votes, article_id) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  return db.query(query, [votes, article_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "No Article Found." });
    }
    return result.rows;
  });
};

exports.selectUsers = () => {
  const query = `SELECT * FROM users;`;

  return db.query(query).then((result) => {
    return result.rows;
  });
};
