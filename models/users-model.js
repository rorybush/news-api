const db = require("../db/connection");

exports.selectUsers = () => {
  const query = `SELECT * FROM users;`;

  return db.query(query).then((result) => {
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
