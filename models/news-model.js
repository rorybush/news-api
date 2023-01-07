const db = require("../db/connection");

exports.selectTopics = () => {
  const query = `SELECT * FROM topics;`;
  return db.query(query).then((result) => {
    return result;
  });
};

exports.selectArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p
) => {
  const validSortByQueries = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderByQueries = ["ASC", "DESC"];
  const validTopicQueries = ["cats", "paper", "mitch"];

  let query = `
  SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, 
  COUNT(comments.article_id)::INTEGER AS comment_count
  FROM articles  
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;

  if (validTopicQueries.includes(topic)) {
    query += ` WHERE articles.topic = '${topic}'`;
  } else if (topic) {
    return Promise.reject({ status: 404, msg: "Invalid Topic" });
  }

  if (validSortByQueries.includes(sort_by)) {
    query += ` GROUP BY articles.article_id ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 404, msg: "Invalid sort_by" });
  }

  if (validOrderByQueries.includes(order)) {
    query += ` ${order}`;
  } else {
    return Promise.reject({ status: 404, msg: "Invalid order" });
  }

  if (p) {
    query += ` LIMIT ${limit} OFFSET ${limit * (p - 1)};`;
  }

  query += `;`;

  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.selectArticlesById = (article_id) => {
  const query = `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, 
  COUNT(comments.article_id)::INTEGER 
  AS comment_count
  FROM articles  
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;

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

exports.removeCommentById = (comment_id) => {
  const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;

  return db.query(query, [comment_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "No Comment Found" });
    }
    return result.rows;
  });
};

exports.selectUserByUsername = (username) => {
  const query = `SELECT * FROM users WHERE username = $1;`;

  return db.query(query, [username]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No user found" });
    }
    return rows;
  });
};

exports.updateCommentVotes = (comment_id, vote) => {
  const query = `UPDATE "comments" SET votes = votes + $1 WHERE "comment_id" = $2 RETURNING *;`;

  return db.query(query, [vote, comment_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "No comment found" });
    }
    return rows[0];
  });
};

exports.insertArticle = (title, topic, author, body) => {
  const query = `INSERT INTO articles
  (author, topic, title, body)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`;

  return db.query(query, [author, topic, title, body]).then((res) => {
    return res.rows[0];
  });
};
