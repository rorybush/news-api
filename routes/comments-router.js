const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  updateVoteCount,
} = require("../controllers/comments-controller");

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", updateVoteCount);

module.exports = commentsRouter;
