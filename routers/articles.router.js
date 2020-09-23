const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/controllers");

articlesRouter.get("/:article_id", getArticleById);

module.exports = articlesRouter;
