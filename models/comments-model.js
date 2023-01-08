const db = require("../db/connection");

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

exports.removeCommentById = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;

  return db.query(query, [comment_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "No Comment Found" });
    }
    return result.rows;
  });
};

exports.updateCommentVotes = (comment_id, vote) => {
  const query = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`;

  return db.query(query, [vote, comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No comment found" });
    }
    return rows[0];
  });
};
