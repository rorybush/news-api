exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  }
  if (err.code === "23503") {
    if (err.constraint === "comments_author_fkey") {
      res.status(404).send({ msg: "No Username Found" });
    }
    if (err.constraint === "comments_article_id_fkey") {
      res.status(404).send({ msg: "No Article Found" });
    }
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "The Input is Invalid" });
  }
};
exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error." });
};
