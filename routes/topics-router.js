const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics-controller");

// GET - api/topics - Get All Topics
topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
